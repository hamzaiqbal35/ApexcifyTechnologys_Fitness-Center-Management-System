import api from './api';

export const trainingPlanService = {
    // Get workout plans
    getWorkoutPlans: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/workout-plans?${params}`);
        return response.data;
    },

    // Get workout plan by ID
    getWorkoutPlan: async (planId) => {
        const response = await api.get(`/workout-plans/${planId}`);
        return response.data;
    },

    // Upload workout plan (trainer)
    uploadWorkoutPlan: async (formData) => {
        const response = await api.post('/workout-plans', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete workout plan (trainer)
    deleteWorkoutPlan: async (planId) => {
        const response = await api.delete(`/workout-plans/${planId}`);
        return response.data;
    },

    // Get diet plans
    getDietPlans: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/diet-plans?${params}`);
        return response.data;
    },

    // Get diet plan by ID
    getDietPlan: async (planId) => {
        const response = await api.get(`/diet-plans/${planId}`);
        return response.data;
    },

    // Upload diet plan (trainer)
    uploadDietPlan: async (formData) => {
        const response = await api.post('/diet-plans', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete diet plan (trainer)
    deleteDietPlan: async (planId) => {
        const response = await api.delete(`/diet-plans/${planId}`);
        return response.data;
    },
};
