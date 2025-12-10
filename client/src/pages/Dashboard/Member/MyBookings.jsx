import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../services/classService';
import QRModal from '../../../components/QRModal';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [classFilter, setClassFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        const reason = window.prompt('Reason for cancellation (optional):');
        if (reason !== null) {
            try {
                await bookingService.cancelBooking(id, reason);
                fetchBookings();
            } catch (error) {
                console.error("Failed to cancel booking", error);
                alert(error.response?.data?.message || 'Failed to cancel booking');
            }
        }
    }

    // --- Filter Helpers ---
    const getBookingStatus = (booking) => {
        if (booking.status === 'cancelled') return 'cancelled';
        if (booking.status === 'checked_in') return 'checked_in';

        const now = new Date();
        const start = new Date(booking.classId?.startTime);
        const end = new Date(booking.classId?.endTime);

        if (now > end) return 'Completed';
        if (now >= start && now <= end) return 'Ongoing';
        if (now < start) return 'Upcoming';

        return booking.status; // Fallback
    };

    const isDateInFilter = (dateStr, filter) => {
        if (filter === 'All') return true;

        const date = new Date(dateStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (filter === 'Today') {
            return dateDay.getTime() === today.getTime();
        }

        if (filter === 'This Week') {
            const firstDay = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
            const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6)); // Saturday
            return date >= firstDay && date <= lastDay;
        }

        if (filter === 'This Month') {
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        }
        return true;
    };

    // --- Identfiy Next Upcoming Class (for filter separation) ---
    const sortedBookings = [...bookings].sort((a, b) => new Date(a.classId?.startTime) - new Date(b.classId?.startTime));
    const upcomingBookings = sortedBookings.filter(b => getBookingStatus(b) === 'Upcoming');
    const nextBookingId = upcomingBookings.length > 0 ? upcomingBookings[0]._id : null;

    // --- Unique Class Names for Dropdown ---
    const classNames = ['All', ...new Set(bookings.map(b => b.classId?.name).filter(Boolean))];

    // --- Filtered Data ---
    const filteredBookings = sortedBookings.filter(booking => {
        const computedStatus = getBookingStatus(booking);

        // Class Name Filter
        if (classFilter !== 'All' && booking.classId?.name !== classFilter) {
            return false;
        }

        // Date Filter
        if (!isDateInFilter(booking.classId?.startTime, dateFilter)) {
            return false;
        }

        // Status Filter
        if (statusFilter !== 'All') {
            if (statusFilter === 'Upcoming') {
                return booking._id === nextBookingId;
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
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>

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

            <div className="card overflow-hidden">
                {loading ? <p className="p-4">Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map((booking) => {
                                    const displayStatus = getBookingStatus(booking);
                                    return (
                                        <tr key={booking._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.classId?.name || 'Class Removed'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.classId?.startTime ? new Date(booking.classId.startTime).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.classId?.trainerId?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${displayStatus === 'Ongoing' || displayStatus === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                                        displayStatus === 'Completed' ? 'bg-gray-100 text-gray-800' :
                                                            displayStatus === 'checked_in' ? 'bg-green-100 text-green-800' :
                                                                displayStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {displayStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {(booking.status === 'booked' && displayStatus !== 'Completed') && (
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className="text-primary-600 hover:text-primary-900"
                                                        >
                                                            Check In
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(booking._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {displayStatus === 'Completed' && (
                                                    <span className="text-gray-400 italic">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredBookings.length === 0 && <p className="p-4 text-center text-gray-500">No bookings match your filters.</p>}
                    </div>
                )}
            </div>

            {selectedBooking && (
                <QRModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default MyBookings;


