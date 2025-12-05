import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ManageClasses = () => {
    const [classes, setClasses] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const { data } = await api.get('/classes');
            setClasses(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch classes", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classes', {
                name,
                description,
                startTime,
                duration: Number(duration),
                capacity: Number(capacity)
            });
            setName('');
            setDescription('');
            setStartTime('');
            setDuration('');
            setCapacity('');
            fetchClasses();
        } catch (error) {
            console.error("Failed to create class", error);
            alert(error.response?.data?.message || 'Failed to create class');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/classes/${id}`);
                fetchClasses();
            } catch (error) {
                console.error("Failed to delete class", error);
            }
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Manage Classes</h2>

            {/* Create Class Form */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule New Class</h3>
                <form onSubmit={handleCreateClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input-field" type="text" placeholder="Class Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input className="input-field" type="datetime-local" placeholder="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    <input className="input-field" type="number" placeholder="Duration (mins)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                    <input className="input-field" type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                    <textarea className="input-field md:col-span-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button type="submit" className="btn-primary md:col-span-2">Create Class</button>
                </form>
            </div>

            {/* Classes List */}
            <div className="card overflow-hidden">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Classes</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classes.map((cls) => (
                                    <tr key={cls._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cls.startTime).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.trainer?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.enrolledCount} / {cls.capacity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDelete(cls._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageClasses;
