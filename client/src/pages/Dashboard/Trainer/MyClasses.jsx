import React, { useState, useEffect } from 'react';
// import { classService } from '../../../services/classService'; // We'll use a generic fetch for now
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import AttendanceModal from './AttendanceModal';
import { classService } from '../../../services/classService';

const MyClasses = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClassForAttendance, setSelectedClassForAttendance] = useState(null);

    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                // Assuming backend has an endpoint to filter classes by trainer (current user)
                // Or we fetch all and filter client side if volume is low, but better to query.
                // adminService uses /classes usually. Let's try to pass a query param ?trainer=me
                // For now, let's fetch all and filter by current user ID logic is safer if backend supports it.
                // Ideally: GET /api/classes/my-classes

                // Filter by current user ID (trainerId)
                const response = await api.get(`/classes?trainerId=${user._id}`);
                // API returns array directly
                setClasses(response.data || []);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyClasses();
        fetchMyClasses();
    }, []);

    const handleCancelClass = async (classId) => {
        const reason = window.prompt("Reason for cancellation?");
        if (!reason) return;

        if (!window.confirm("Are you sure you want to cancel this class?")) return;

        try {
            await classService.deleteClass(classId); // The backend logic handles "deletion" as "cancellation" status update
            // Refresh list
            const response = await api.get(`/classes?trainerId=${user._id}`);
            setClasses(response.data || []);
        } catch (error) {
            console.error("Failed to cancel class", error);
            alert("Failed to cancel class");
        }
    };

    // Filter logic: In a real app, this should be backend side. 
    // Here we might just be seeing all classes if the user is a trainer? 
    // Or we filter by the trainer's ID matching the class trainer field. 
    // We'll trust the API for now or display all relevant info.

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>

            <div className="card">
                {loading ? <p>Loading schedule...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classes.map((cls) => (
                                    <tr key={cls._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{cls.name}</div>
                                            <div className="text-xs text-gray-500">{cls.location || 'Main Studio'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(cls.startTime).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.duration} mins</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {cls.attendees?.length || 0} / {cls.capacity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${cls.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {cls.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedClassForAttendance(cls)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Attendance
                                                </button>
                                                {cls.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancelClass(cls._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {classes.length === 0 && <p className="p-4">No classes scheduled.</p>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedClassForAttendance && (
                <AttendanceModal
                    classId={selectedClassForAttendance._id}
                    classDetails={selectedClassForAttendance}
                    onClose={() => setSelectedClassForAttendance(null)}
                />
            )}
        </div>
    );
};

export default MyClasses;
