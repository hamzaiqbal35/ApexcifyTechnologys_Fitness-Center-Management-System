const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'pkr',
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
    },
    // Stripe integration
    stripePaymentIntentId: {
        type: String,
    },
    stripeInvoiceId: {
        type: String,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
    },
    // Refund tracking
    refundedAt: {
        type: Date,
    },
    refundReason: {
        type: String,
    },
    // Reconciliation
    reconciled: {
        type: Boolean,
        default: false,
    },
    reconciledAt: {
        type: Date,
    },
    description: {
        type: String,
    },
    metadata: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ reconciled: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

