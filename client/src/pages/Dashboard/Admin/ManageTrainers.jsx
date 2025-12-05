import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const ManageTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchTrainers = async () => {
        try {
            const { data } = await api.get('/users/trainers');
            setTrainers(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch trainers", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleAddTrainer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/trainers', {
                name,
                email,
                password,
                specialization,
                experience
            });
            setName('');
            setEmail('');
            setPassword('');
            setSpecialization('');
            setExperience('');
            fetchTrainers();
        } catch (error) {
            console.error("Failed to add trainer", error);
            alert(error.response?.data?.message || 'Failed to add trainer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchTrainers();
            } catch (error) {
                console.error("Failed to delete trainer", error);
            }
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Manage Trainers</h2>

            {/* Add Trainer Form */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Trainer</h3>
                <form onSubmit={handleAddTrainer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input-field" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input className="input-field" type="text" placeholder="Specialization (e.g. Yoga, HIIT)" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                    <input className="input-field" type="number" placeholder="Experience (years)" value={experience} onChange={(e) => setExperience(e.target.value)} />
                    <button type="submit" className="btn-primary md:col-span-2">Add Trainer</button>
                </form>
            </div>

            {/* Trainers List */}
            <div className="card overflow-hidden">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Trainers</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trainers.map((trainer) => (
                                    <tr key={trainer._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trainer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trainer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trainer.specialization || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDelete(trainer._id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default ManageTrainers;
