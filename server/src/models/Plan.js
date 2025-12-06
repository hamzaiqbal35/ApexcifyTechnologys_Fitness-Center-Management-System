const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'pkr',
    },
    interval: {
        type: String,
        enum: ['month', 'year'],
        required: true,
    },
    stripePriceId: {
        type: String,
        required: true,
        unique: true,
    },
    stripeProductId: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    classesPerMonth: {
        type: Number,
        default: 0, // 0 = unlimited
    },
}, {
    timestamps: true,
});

// Index for active plans
planSchema.index({ isActive: 1 });

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
