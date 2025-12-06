const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getWorkoutPlans,
    getWorkoutPlan,
    uploadWorkoutPlan,
    deleteWorkoutPlan,
} = require('../controllers/workoutPlanController');

// Get all workout plans (with visibility filtering)
router.get('/', protect, getWorkoutPlans);

// Get workout plan by ID
router.get('/:id', protect, getWorkoutPlan);

// Upload workout plan (trainer/admin)
router.post(
    '/',
    protect,
    authorize('trainer', 'admin'),
    upload.single('file'),
    uploadWorkoutPlan
);

// Delete workout plan (trainer/admin)
router.delete('/:id', protect, authorize('trainer', 'admin'), deleteWorkoutPlan);

module.exports = router;
