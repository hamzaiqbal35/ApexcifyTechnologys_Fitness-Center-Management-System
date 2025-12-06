import React, { useState, useEffect } from 'react';
import { classService } from '../../../services/classService';
import { useAuth } from '../../../contexts/AuthContext';

const ClassBooking = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: new Date().toISOString().split('T')[0], // Today
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    });

    useEffect(() => {
        loadClasses();
    }, [filters]);

    const loadClasses = async () => {
        setLoading(true);
        try {
            const data = await classService.getClasses({
                ...filters,
                status: 'scheduled',
                available: true
            });
            setClasses(data);
        } catch (error) {
            console.error("Failed to load classes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (classId) => {
        if (!window.confirm('Confirm booking for this class?')) return;

        try {
            await classService.bookClass(classId);
            alert('Class booked successfully!');
            loadClasses(); // Refresh availability
        } catch (error) {
            console.error("Booking failed", error);
            alert(error.response?.data?.message || 'Failed to book class');
        }
    };

    const handleDateChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Book a Class</h2>

                {/* Filters */}
                <div className="flex gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleDateChange}
                            className="input-field py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleDateChange}
                            className="input-field py-1"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.length > 0 ? (
                        classes.map((cls) => (
                            <div key={cls._id} className="card hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{cls.name}</h3>
                                        <p className="text-primary-600 font-medium text-sm">{cls.trainerId?.name || 'Instructor'}</p>
                                    </div>
                                    <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
                                        {cls.duration} min
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(cls.startTime).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        {cls.attendees?.length || 0} / {cls.capacity} spots taken
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBook(cls._id)}
                                    className="w-full mt-4 btn-primary"
                                    disabled={cls.isFull}
                                >
                                    {cls.isFull ? 'Join Waitlist' : 'Book Class'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-100">
                            <p className="text-lg">No classes scheduled for this period.</p>
                            <p className="text-sm">Try changing the date range.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClassBooking;
