const express = require('express');
const router = express.Router();
const { createPaymentIntent, recordPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/record', protect, recordPayment);

module.exports = router;
