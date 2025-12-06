const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true,
    },
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
    method: {
        type: String,
        enum: ['qr', 'manual'],
        required: true,
    },
    checkedInAt: {
        type: Date,
        default: Date.now,
    },
    checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Only required for manual check-ins
    },
    metadata: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,
});

// Indexes for reporting
attendanceSchema.index({ memberId: 1, checkedInAt: -1 });
attendanceSchema.index({ classId: 1 });
attendanceSchema.index({ checkedInAt: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
