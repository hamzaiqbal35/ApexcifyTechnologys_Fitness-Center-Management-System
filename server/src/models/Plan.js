const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['workout', 'diet'],
        required: true
    },
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId, // Admin or Trainer
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, // Member (optional, if private plan)
        ref: 'User'
    },
    content: {
        type: String, // Can be text or a URL to a file/video
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true // Public means accessible to all members
    }
}, {
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
