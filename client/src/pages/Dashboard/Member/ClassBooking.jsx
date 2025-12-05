import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ClassBooking = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const { data } = await api.get('/classes');
            // Filter out past classes
            const upcomingClasses = data.filter(c => new Date(c.startTime) > new Date());
            setClasses(upcomingClasses);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch classes", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleBook = async (classId) => {
        try {
            await api.post('/bookings', { classId });
            alert('Class booked successfully!');
            fetchClasses(); // Refresh to update enrolled count
        } catch (error) {
            console.error("Failed to book class", error);
            alert(error.response?.data?.message || 'Failed to book class');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Available Classes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading...</p> : classes.map((cls) => (
                    <div key={cls._id} className="card hover:shadow-md transition-shadow border-l-4 border-l-primary-500">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-xs font-medium">
                                {cls.duration} mins
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{new Date(cls.startTime).toLocaleString()}</p>
                        <p className="mt-3 text-gray-600">{cls.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="font-medium mr-1">Trainer:</span> {cls.trainer?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {cls.enrolledCount}/{cls.capacity} spots
                            </div>
                        </div>

                        <button
                            onClick={() => handleBook(cls._id)}
                            className="w-full mt-4 btn-primary"
                            disabled={cls.enrolledCount >= cls.capacity}
                        >
                            {cls.enrolledCount >= cls.capacity ? 'Full' : 'Book Now'}
                        </button>
                    </div>
                ))}
            </div>
            {classes.length === 0 && !loading && <p className="text-center text-gray-500">No upcoming classes available.</p>}
        </div>
    );
};

export default ClassBooking;
