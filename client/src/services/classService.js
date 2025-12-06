import api from './api';

export const classService = {
    // Get all classes with filters
    getClasses: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/classes?${params}`);
        return response.data;
    },

    // Get class by ID
    getClass: async (classId) => {
        const response = await api.get(`/classes/${classId}`);
        return response.data;
    },

    // Create class (trainer)
    createClass: async (classData) => {
        const response = await api.post('/classes', classData);
        return response.data;
    },

    // Update class (trainer)
    updateClass: async (classId, classData) => {
        const response = await api.put(`/classes/${classId}`, classData);
        return response.data;
    },

    // Delete/cancel class (trainer)
    deleteClass: async (classId) => {
        const response = await api.delete(`/classes/${classId}`);
        return response.data;
    },

    // Book class (member)
    bookClass: async (classId) => {
        const response = await api.post(`/classes/${classId}/book`);
        return response.data;
    },

    // Complete class (trainer)
    completeClass: async (classId) => {
        const response = await api.put(`/classes/${classId}/complete`);
        return response.data;
    },
};

export const bookingService = {
    // Get my bookings
    getMyBookings: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/bookings/my-bookings?${params}`);
        return response.data;
    },

    // Get booking by ID
    getBooking: async (bookingId) => {
        const response = await api.get(`/bookings/${bookingId}`);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (bookingId, reason) => {
        const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
        return response.data;
    },

    // Generate QR token
    generateQR: async (bookingId) => {
        const response = await api.post(`/bookings/${bookingId}/generate-qr`);
        return response.data;
    },
};
