const express = require('express');
const router = express.Router();
const { getMyBookings, getBooking, cancelBooking, generateQRToken } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/generate-qr', generateQRToken);

module.exports = router;

