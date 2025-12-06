const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'checked_in', 'completed', 'cancelled', 'no_show'],
        default: 'booked',
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
    cancelledAt: {
        type: Date,
    },
    cancellationReason: {
        type: String,
    },
    qrToken: {
        type: String,
    },
    qrTokenExpiry: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Compound unique index to prevent duplicate bookings
bookingSchema.index({ memberId: 1, classId: 1 }, { unique: true });
bookingSchema.index({ memberId: 1, status: 1 });
bookingSchema.index({ classId: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
