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

    // Filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [classFilter, setClassFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');

    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
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

    // --- Filter Helpers ---
    const getClassStatus = (cls) => {
        if (cls.status === 'cancelled') return 'cancelled';

        const now = new Date();
        const start = new Date(cls.startTime);
        const end = new Date(cls.endTime);

        if (now > end) return 'Completed';
        if (now >= start && now <= end) return 'Ongoing';
        if (now < start) return 'Upcoming';

        return cls.status; // Fallback to 'scheduled' if calculation fails but shouldn't
    };

    const isDateInFilter = (dateStr, filter) => {
        if (filter === 'All') return true;

        const date = new Date(dateStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (filter === 'Today') {
            const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return dateDay.getTime() === today.getTime();
        }

        if (filter === 'This Week') {
            const firstDay = new Date(now);
            firstDay.setDate(now.getDate() - now.getDay()); // Sunday
            const lastDay = new Date(now);
            lastDay.setDate(now.getDate() - now.getDay() + 6); // Saturday
            return date >= firstDay && date <= lastDay;
        }

        if (filter === 'This Month') {
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        }
        return true;
    };

    // --- Identfiy Next Upcoming Class (for filter separation) ---
    const sortedClasses = [...classes].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const upcomingClasses = sortedClasses.filter(c => getClassStatus(c) === 'Upcoming');
    const nextClassId = upcomingClasses.length > 0 ? upcomingClasses[0]._id : null;

    // --- Unique Class Names for Dropdown ---
    const classNames = ['All', ...new Set(classes.map(c => c.name).filter(Boolean))];

    // --- Filtered Data ---
    const filteredClasses = sortedClasses.filter(cls => {
        const computedStatus = getClassStatus(cls);

        // Class Name Filter
        if (classFilter !== 'All' && cls.name !== classFilter) {
            return false;
        }

        // Date Filter
        if (!isDateInFilter(cls.startTime, dateFilter)) {
            return false;
        }

        // Status Filter
        if (statusFilter !== 'All') {
            if (statusFilter === 'Upcoming') {
                return cls._id === nextClassId;
            }
            if (statusFilter === 'scheduled') {
                return computedStatus === 'Upcoming';
            }
            if (computedStatus.toLowerCase() !== statusFilter.toLowerCase()) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>

            {/* --- Filters UI --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Class Name Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                    <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                        {classNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                {/* Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                        <option value="All">All Dates</option>
                        <option value="Today">Today</option>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                    </select>
                </div>
            </div>

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
                                {filteredClasses.map((cls) => {
                                    const displayStatus = getClassStatus(cls);
                                    const isCompleted = displayStatus === 'Completed';

                                    return (
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
                                                    ${displayStatus === 'Ongoing' || displayStatus === 'Upcoming' ? 'bg-green-100 text-green-800' :
                                                        displayStatus === 'Completed' ? 'bg-gray-100 text-gray-800' :
                                                            displayStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {displayStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    {!isCompleted && cls.status !== 'cancelled' ? (
                                                        <button
                                                            onClick={() => setSelectedClassForAttendance(cls)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Attendance
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 cursor-not-allowed">
                                                            {isCompleted ? 'Completed' : 'Cancelled'}
                                                        </span>
                                                    )}

                                                    {cls.status !== 'cancelled' && !isCompleted && (
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
                                    );
                                })}
                                {filteredClasses.length === 0 && <p className="p-4">No classes match your filters.</p>}
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
