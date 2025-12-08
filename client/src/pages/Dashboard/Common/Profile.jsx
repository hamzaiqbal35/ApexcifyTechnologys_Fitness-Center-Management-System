import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

const Profile = () => {
    const { user, login } = useAuth(); // login is used to update local user state
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        // Member specific
        age: '',
        gender: '',
        goals: '',
        healthConditions: '',
        // Trainer specific
        specialization: '',
        experience: '',
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                // Flatten nested profile object for form
                age: user.profile?.age || '',
                gender: user.profile?.gender || '',
                goals: user.profile?.goals || '',
                healthConditions: user.profile?.healthConditions || '',
                // Trainer fields
                specialization: user.specialization || '',
                experience: user.experience || '',
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', content: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            // Construct payload based on role and structure
            const payload = {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                role: user.role, // Keep existing role
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            // Member specific profile nesting
            if (user.role === 'member') {
                payload.profile = {
                    age: formData.age,
                    gender: formData.gender,
                    goals: formData.goals,
                    healthConditions: formData.healthConditions,
                };
            }

            // Trainer specific fields
            if (user.role === 'trainer') {
                payload.specialization = formData.specialization;
                payload.experience = formData.experience;
            }

            const response = await api.put('/users/profile', payload);

            // Update local context
            // Assuming the response returns the updated user object and a fresh token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            // We might need to manually trigger a reload or update context if 'login' doesn't replace state deeply enough
            // For now, let's assume valid data return
            setMessage({ type: 'success', content: 'Profile updated successfully' });
            setIsEditing(false);

            // Refresh page or context to reflect changes if needed, 
            // typically useAuth().updateUser(response.data) would be better but reloading works for now
            window.location.reload();

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', content: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

            {message.content && (
                <div className={`p-4 rounded-xl ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message.content}
                </div>
            )}

            <div className="card">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Avatar Section */}
                    <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary-500/30">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-sm font-medium text-gray-500 capitalize">{user?.role}</p>
                            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full btn-primary"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Main Content Form */}
                    <div className="w-full md:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            disabled={!isEditing}
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            disabled={!isEditing}
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            disabled={!isEditing}
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role Specific Fields */}
                            {user?.role === 'member' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-4">Fitness Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                disabled={!isEditing}
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Gender</label>
                                            <select
                                                name="gender"
                                                disabled={!isEditing}
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="label">Fitness Goals</label>
                                            <textarea
                                                name="goals"
                                                disabled={!isEditing}
                                                value={formData.goals}
                                                onChange={handleChange}
                                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                                rows="3"
                                                placeholder="What do you want to achieve?"
                                            ></textarea>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="label">Health Conditions</label>
                                            <textarea
                                                name="healthConditions"
                                                disabled={!isEditing}
                                                value={formData.healthConditions}
                                                onChange={handleChange}
                                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                                rows="2"
                                                placeholder="Any allergies or injuries?"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user?.role === 'trainer' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-4">Professional Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Specialization</label>
                                            <input
                                                type="text"
                                                name="specialization"
                                                disabled={!isEditing}
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Experience (Years)</label>
                                            <input
                                                type="number"
                                                name="experience"
                                                disabled={!isEditing}
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Password Reset (Only in Edit Mode) */}
                            {isEditing && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-4">Security</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">New Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="input-field"
                                                placeholder="Leave blank to keep current"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="input-field"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setMessage({ type: '', content: '' });
                                            // Reset form to user state
                                            // Ideally we'd have a separate reset function related to useEffect
                                            window.location.reload();
                                        }}
                                        className="btn-secondary"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
