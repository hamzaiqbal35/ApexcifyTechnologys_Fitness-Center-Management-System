const express = require('express');
const router = express.Router();
const { getClasses, getClassById, createClass, updateClass, deleteClass, completeClass } = require('../controllers/classController');
const { bookClass } = require('../controllers/bookingController');
const { protect, authorize, requireActiveSubscription } = require('../middleware/authMiddleware');

router.route('/')
    .get(getClasses)
    .post(protect, authorize('admin'), createClass);

router.route('/:id')
    .get(getClassById)
    .put(protect, authorize('admin', 'trainer'), updateClass)
    .delete(protect, authorize('admin', 'trainer'), deleteClass);

// Book a class (requires active subscription for members)
router.post('/:classId/book', protect, requireActiveSubscription, bookClass);

// Complete a class (trainer only)
router.put('/:id/complete', protect, authorize('trainer'), completeClass);

module.exports = router;

