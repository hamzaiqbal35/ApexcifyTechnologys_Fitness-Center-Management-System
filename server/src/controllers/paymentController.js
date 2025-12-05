const Stripe = require('stripe');
const Payment = require('../models/Payment');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency || 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record payment success
// @route   POST /api/payments/record
// @access  Private
const recordPayment = async (req, res) => {
    const { paymentIntentId, amount, status } = req.body;

    const payment = await Payment.create({
        user: req.user._id,
        amount,
        stripePaymentId: paymentIntentId,
        status: status || 'succeeded',
    });

    if (payment) {
        res.status(201).json(payment);
    } else {
        res.status(400).json({ message: 'Invalid payment data' });
    }
};

module.exports = { createPaymentIntent, recordPayment };
