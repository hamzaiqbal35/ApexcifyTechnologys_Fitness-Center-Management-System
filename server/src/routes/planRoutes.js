const express = require('express');
const router = express.Router();
const { getPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPlans)
    .post(protect, authorize('admin', 'trainer'), createPlan);

router.route('/:id')
    .put(protect, authorize('admin', 'trainer'), updatePlan)
    .delete(protect, authorize('admin', 'trainer'), deletePlan);

module.exports = router;
