const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getDietPlans,
    getDietPlan,
    uploadDietPlan,
    deleteDietPlan,
} = require('../controllers/dietPlanController');

// Get all diet plans (with visibility filtering)
router.get('/', protect, getDietPlans);

// Get diet plan by ID
router.get('/:id', protect, getDietPlan);

// Upload diet plan (trainer/admin)
router.post(
    '/',
    protect,
    authorize('trainer', 'admin'),
    upload.single('file'),
    uploadDietPlan
);

// Delete diet plan (trainer/admin)
router.delete('/:id', protect, authorize('trainer', 'admin'), deleteDietPlan);

module.exports = router;
