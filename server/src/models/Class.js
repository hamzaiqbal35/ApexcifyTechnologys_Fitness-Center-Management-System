const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    waitlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    metadata: {
        type: Object,
        default: {},
    },
    recurrenceGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries and conflict detection
classSchema.index({ trainerId: 1, startTime: 1 });
classSchema.index({ startTime: 1, status: 1 });
classSchema.index({ status: 1 });

// Virtual for checking if class is full
classSchema.virtual('isFull').get(function () {
    if (!this.attendees) return false;
    return this.attendees.length >= this.capacity;
});

// Virtual for available spots
classSchema.virtual('availableSpots').get(function () {
    if (!this.attendees) return this.capacity;
    return Math.max(0, this.capacity - this.attendees.length);
});

// Ensure virtuals are included in JSON
classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
