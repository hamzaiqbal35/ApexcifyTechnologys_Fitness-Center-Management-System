const express = require('express');
const router = express.Router();
const { getUsers, getTrainers, createTrainer, deleteUser, updateUserProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/trainers')
    .get(getTrainers)
    .post(protect, authorize('admin'), createTrainer);

router.route('/profile').put(protect, updateUserProfile);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
