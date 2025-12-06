const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getSubscriptionPlans,
    getSubscriptionPlan,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
} = require('../controllers/subscriptionPlanController');

// Public routes
router.get('/', getSubscriptionPlans);
router.get('/:id', getSubscriptionPlan);

// Admin routes
router.post('/', protect, authorize('admin'), createSubscriptionPlan);
router.put('/:id', protect, authorize('admin'), updateSubscriptionPlan);
router.delete('/:id', protect, authorize('admin'), deleteSubscriptionPlan);

module.exports = router;
