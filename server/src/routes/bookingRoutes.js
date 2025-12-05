const express = require('express');
const router = express.Router();
const { bookClass, getMyBookings, cancelBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, bookClass);

router.route('/mybookings')
    .get(protect, getMyBookings);

router.route('/:id')
    .delete(protect, cancelBooking);

router.route('/:id/status')
    .put(protect, authorize('admin', 'trainer'), updateBookingStatus); // Add authorize middleware

module.exports = router;
