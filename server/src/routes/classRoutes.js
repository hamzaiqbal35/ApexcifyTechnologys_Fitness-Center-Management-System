const express = require('express');
const router = express.Router();
const { getClasses, getClassById, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getClasses)
    .post(protect, authorize('admin', 'trainer'), createClass);

router.route('/:id')
    .get(getClassById)
    .put(protect, authorize('admin', 'trainer'), updateClass)
    .delete(protect, authorize('admin', 'trainer'), deleteClass);

module.exports = router;
