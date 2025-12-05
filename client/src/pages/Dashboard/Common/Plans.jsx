import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

const Plans = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [type, setType] = useState('workout'); // workout or diet
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const fetchPlans = async () => {
        try {
            const { data } = await api.get('/plans');
            setPlans(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch plans", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plans', {
                title,
                type,
                description,
                content,
                isPublic
            });
            setTitle('');
            setDescription('');
            setContent('');
            fetchPlans();
        } catch (error) {
            console.error("Failed to create plan", error);
            alert(error.response?.data?.message || 'Failed to create plan');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/plans/${id}`);
                fetchPlans();
            } catch (error) {
                console.error("Failed to delete plan", error);
            }
        }
    }

    const canCreate = user.role === 'admin' || user.role === 'trainer';

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Workout & Diet Plans</h2>

            {/* Create Plan Form (Admin/Trainer Only) */}
            {canCreate && (
                <div className="card">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Plan</h3>
                    <form onSubmit={handleCreatePlan} className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input-field" type="text" placeholder="Plan Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="workout">Workout Plan</option>
                                <option value="diet">Diet Plan</option>
                            </select>
                        </div>
                        <input className="input-field" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <textarea className="input-field h-32" placeholder="Content (Details, URLs, etc.)" value={content} onChange={(e) => setContent(e.target.value)} required />
                        <div className="flex items-center">
                            <input type="checkbox" id="isPublic" className="mr-2" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                            <label htmlFor="isPublic">Public (Visible to all members)</label>
                        </div>
                        <button type="submit" className="btn-primary">Create Plan</button>
                    </form>
                </div>
            )}

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading...</p> : plans.map((plan) => (
                    <div key={plan._id} className="card hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${plan.type === 'workout' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {plan.type.toUpperCase()}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">By {plan.creator?.name}</p>
                            </div>
                            {canCreate && (plan.creator?._id === user._id || user.role === 'admin') && (
                                <button onClick={() => handleDelete(plan._id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                            )}
                        </div>
                        <p className="mt-4 text-gray-600 truncate">{plan.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <details>
                                <summary className="text-primary-600 cursor-pointer font-medium">View Content</summary>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{plan.content}</p>
                            </details>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
