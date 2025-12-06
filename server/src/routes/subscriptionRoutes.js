const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createSubscription,
    createCheckoutSession,
    syncSubscription,
    cancelSubscription,
    getMySubscriptions,
    getSubscription,
    reactivateSubscription,
} = require('../controllers/subscriptionController');

// All routes require authentication
router.use(protect);

router.post('/create', createSubscription);
router.post('/create-checkout-session', createCheckoutSession);
router.post('/sync', syncSubscription);
router.post('/cancel', cancelSubscription);
router.get('/my-subscriptions', getMySubscriptions);
router.get('/:id', getSubscription);
router.put('/:id/reactivate', reactivateSubscription);

module.exports = router;
