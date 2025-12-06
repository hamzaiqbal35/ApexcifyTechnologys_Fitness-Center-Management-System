import React, { useState } from 'react';
// import { adminService } from '../../../services/adminService'; // Needs implementation

const Notifications = () => {
    const [formData, setFormData] = useState({
        recipientType: 'all', // all, trainers, members, specific
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!confirm("Are you sure you want to send this notification?")) return;

        setLoading(true);
        try {
            // await adminService.sendNotification(formData);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            alert("Notification sent successfully! (Mock)");
            setFormData({ recipientType: 'all', subject: '', message: '' });
        } catch (error) {
            console.error("Failed to send notification", error);
            alert("Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">System Notifications</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Notification Form */}
                <div className="card">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Send New Notification</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Recipients</label>
                            <select
                                className="input-field mt-1"
                                value={formData.recipientType}
                                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                            >
                                <option value="all">All Users</option>
                                <option value="members">All Members</option>
                                <option value="trainers">All Trainers</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <input
                                type="text"
                                className="input-field mt-1"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="e.g., Gym Maintenance Alert"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                className="input-field mt-1 h-32"
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Type your message here..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Sending...' : 'Send Notification'}
                        </button>
                    </form>
                </div>

                {/* Recent Notifications History (Mock) */}
                <div className="card">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Broadcasts</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-gray-900">Welcome to FitTrack</h4>
                                    <span className="text-xs text-gray-500">2 days ago</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Sent to: All Members</p>
                                <p className="text-sm text-gray-700 mt-2">
                                    We are excited to have you on board! Check out our new class schedule...
                                </p>
                            </div>
                        ))}
                        <p className="text-xs text-center text-gray-400 mt-4">Showing last 3 notifications</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
