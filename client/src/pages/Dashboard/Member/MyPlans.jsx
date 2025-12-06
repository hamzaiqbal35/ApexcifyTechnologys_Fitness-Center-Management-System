import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const MyPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPlans = async () => {
            try {
                // Fetch plans where visibility is 'public' OR assigned to user.
                // Assuming /api/workout-plans returns available plans.
                const response = await api.get('/workout-plans');
                // Filter for 'my' plans if backend doesn't presort
                setPlans(response.data || []);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPlans();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">My Workout & Diet Plans</h2>

            {loading ? <p>Loading plans...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan._id} className="card hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-gray-900">{plan.title}</h3>
                            <p className="text-sm text-primary-600 mb-2">{plan.category} • {plan.difficulty}</p>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{plan.description}</p>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">By {plan.trainerId?.name || 'Trainer'}</span>
                                <a
                                    href={`http://localhost:5000/${plan.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary text-xs px-3 py-1"
                                >
                                    Download PDF
                                </a>
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && <p className="col-span-full text-center text-gray-500">No plans assigned yet.</p>}
                </div>
            )}
        </div>
    );
};

export default MyPlans;
