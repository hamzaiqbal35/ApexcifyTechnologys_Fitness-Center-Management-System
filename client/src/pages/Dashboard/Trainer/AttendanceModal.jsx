import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../services/attendanceService';

const AttendanceModal = ({ classId, onClose, classDetails }) => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('roster'); // 'roster' (bookings) or 'history' (attendance records)

    useEffect(() => {
        loadData();
    }, [classId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // We need to fetch the roster (bookings for this class).
            // Currently we don't have a direct "get class roster" endpoint in classService or bookingService explicitly exposed for this UI.
            // But we can use `attendanceService.getClassAttendance` to see who *attended*.
            // To see who *booked*, we might need an endpoint.
            // Let's assume classDetails.attendees (which comes from getClasses) has the list of booked user IDs.
            // But we need names. The getClasses endpoint usually populates attendees.

            // If classDetails.attendees is populated with objects, we can use it.
            // If not, we might need to fetch the class details again with population.

            // For now, let's fetch attendance records to see who is already checked in.
            const attendanceData = await attendanceService.getClassAttendance(classId);
            const checkedInIds = new Set(attendanceData.attendance.map(a => a.memberId._id || a.memberId));

            // Combine with booking list if available
            // If classDetails.attendees is array of objects { _id, name ... }
            if (classDetails && classDetails.attendees) {
                const roster = classDetails.attendees.map(user => ({
                    ...user,
                    checkedIn: checkedInIds.has(user._id),
                    checkInTime: attendanceData.attendance.find(a => (a.memberId._id || a.memberId) === user._id)?.checkedInAt
                }));
                setAttendees(roster);
            } else {
                // Fallback if no detailed roster
                setAttendees([]);
            }
        } catch (error) {
            console.error("Failed to load attendance", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (memberId) => {
        try {
            await attendanceService.manualCheckIn(memberId, classId);
            // Update local state
            setAttendees(prev => prev.map(a =>
                a._id === memberId
                    ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() }
                    : a
            ));
        } catch (error) {
            console.error("Check-in failed", error);
            alert("Failed to manual check-in: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Class Roster</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                        {classDetails.name} • {new Date(classDetails.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm font-medium mt-1">
                        Checked In: {attendees.filter(a => a.checkedIn).length} / {attendees.length}
                    </p>
                </div>

                <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                    {loading ? (
                        <p className="text-center py-4">Loading roster...</p>
                    ) : attendees.length > 0 ? (
                        attendees.map(member => (
                            <div key={member._id} className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                                        {member.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                                <div>
                                    {member.checkedIn ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Checked In {new Date(member.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleCheckIn(member._id)}
                                            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                                        >
                                            Mark Present
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-6 text-gray-500">No members booked this class.</p>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;
