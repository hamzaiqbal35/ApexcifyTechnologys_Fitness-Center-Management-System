const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        default: 20
    },
    enrolledCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
