import api from './api';

export const subscriptionService = {
    // Get all subscription plans
    getPlans: async () => {
        const response = await api.get('/subscription-plans');
        return response.data;
    },

    // Get plan by ID
    getPlan: async (planId) => {
        const response = await api.get(`/subscription-plans/${planId}`);
        return response.data;
    },

    // Create subscription
    createSubscription: async (planId, paymentMethodId) => {
        const response = await api.post('/subscriptions/create', {
            planId,
            paymentMethodId,
        });
        return response.data;
    },

    // Create checkout session
    createCheckoutSession: async (planId) => {
        const response = await api.post('/subscriptions/create-checkout-session', {
            planId,
        });
        return response.data;
    },

    // Sync subscription
    syncSubscription: async (sessionId) => {
        const response = await api.post('/subscriptions/sync', {
            sessionId,
        });
        return response.data;
    },

    // Cancel subscription
    cancelSubscription: async (subscriptionId) => {
        const response = await api.post('/subscriptions/cancel', {
            subscriptionId,
        });
        return response.data;
    },

    // Get my subscriptions
    getMySubscriptions: async () => {
        const response = await api.get('/subscriptions/my-subscriptions');
        return response.data;
    },

    // Reactivate subscription
    reactivateSubscription: async (subscriptionId) => {
        const response = await api.put(`/subscriptions/${subscriptionId}/reactivate`);
        return response.data;
    },
};
