import api from './api';

export const attendanceService = {
    // QR check-in
    checkInWithQR: async (bookingId, token) => {
        const response = await api.post('/attendance/checkin', {
            bookingId,
            token,
        });
        return response.data;
    },

    // Manual check-in (trainer)
    manualCheckIn: async (classId, memberId) => {
        const response = await api.post('/attendance/manual', {
            classId,
            memberId,
        });
        return response.data;
    },

    // Get class attendance (trainer)
    getClassAttendance: async (classId) => {
        const response = await api.get(`/attendance/class/${classId}`);
        return response.data;
    },

    // Get member attendance history
    getMemberAttendance: async (memberId) => {
        const response = await api.get(`/attendance/member/${memberId}`);
        return response.data;
    },
};
