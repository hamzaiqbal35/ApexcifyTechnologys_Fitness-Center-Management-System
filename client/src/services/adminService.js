import api from './api';

export const adminService = {
    // Dashboard & Reports
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getRevenueReport: async (startDate, endDate) => {
        const response = await api.get('/admin/reports/revenue', { params: { startDate, endDate } });
        return response.data;
    },

    getAttendanceReport: async (startDate, endDate) => {
        const response = await api.get('/admin/reports/attendance', { params: { startDate, endDate } });
        return response.data;
    },

    // User Management
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getTrainers: async () => {
        const response = await api.get('/admin/users?role=trainer');
        return response.data;
    },

    createTrainer: async (trainerData) => {
        const response = await api.post('/users/trainers', trainerData);
        return response.data;
    },

    approveTrainer: async (id) => {
        const response = await api.put(`/admin/trainers/${id}/approve`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    suspendUser: async (id) => {
        const response = await api.put(`/admin/users/${id}/suspend`);
        return response.data;
    },

    activateUser: async (id) => {
        const response = await api.put(`/admin/users/${id}/activate`);
        return response.data;
    },

    grantSubscription: async (id) => {
        const response = await api.post(`/admin/users/${id}/grant-subscription`);
        return response.data;
    },

    // Payment Management
    getPayments: async (params) => {
        const response = await api.get('/admin/payments', { params });
        return response.data;
    },

    refundPayment: async (id, reason) => {
        const response = await api.post(`/admin/payments/${id}/refund`, { reason });
        return response.data;
    },

    markPaymentPaid: async (id, data) => {
        const response = await api.post(`/admin/payments/${id}/mark-paid`, data);
        return response.data;
    },

    // Subscription Plan Management (Gym Memberships)
    getSubscriptionPlans: async () => {
        const response = await api.get('/subscription-plans');
        return response.data;
    },

    getSubscriptionPlan: async (id) => {
        const response = await api.get(`/subscription-plans/${id}`);
        return response.data;
    },

    createSubscriptionPlan: async (planData) => {
        const response = await api.post('/subscription-plans', planData);
        return response.data;
    },

    updateSubscriptionPlan: async (id, planData) => {
        const response = await api.put(`/subscription-plans/${id}`, planData);
        return response.data;
    },

    deleteSubscriptionPlan: async (id) => {
        const response = await api.delete(`/subscription-plans/${id}`);
        return response.data;
    },

    // Notification (Mock)
    sendNotification: async (data) => {
        // Placeholder for future backend implementation
        return { success: true };
    }
};
