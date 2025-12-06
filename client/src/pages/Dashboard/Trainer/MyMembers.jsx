import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const MyMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // Ideally we have a dedicated endpoint: POST /users/search or GET /users?trainerId=me
                // For now, let's fetch all users and filter by trainer relation client-side if needed, 
                // OR assume the backend returns relevant data.
                // Let's use the generic admin endpoint restricted to trainers? No, admin endpoints are protected.
                // We need a trainer-accessible endpoint.
                // Assuming we can use GET /api/users if we are authorized? 
                // Or maybe the trainer sees members enrolled in their classes?
                // For MVP, let's just fetch all members if the API allows, or show a placeholder.

                // Let's rely on a hypothetical endpoint for now or reuse adminService with limited scope?
                // Better: Create a mock list or try to fetch from a public profile endpoint.

                // Real implementation: We need a new endpoint `GET /api/trainers/me/members`.
                // I will add a TODO note in the UI.

                // Fetching all users using the existing endpoint might default to 403 for trainers.
                // Let's try to hit /api/users anyway (it might be protected only for admins).

                // Placeholder data for demonstration
                setMembers([
                    { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', plan: 'Yoga Basic', progress: 'On Track' },
                    { _id: '2', name: 'Bob Smith', email: 'bob@example.com', plan: 'Hilt Pro', progress: 'Needs Attention' },
                ]);

            } catch (error) {
                console.error("Failed to fetch members", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">My Members</h2>
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {members.map((member) => (
                                <tr key={member._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                        <div className="text-xs text-gray-500">{member.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.plan}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${member.progress === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {member.progress}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-primary-600 hover:text-primary-900">View Progress</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyMembers;
