const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'trainer', 'member'],
        default: 'member',
    },
    profile: {
        age: Number,
        gender: String,
        healthConditions: String,
        goals: String,
    },
    // For trainers specifically
    specialization: String,
    experience: Number,
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String, // "09:00"
        endTime: String,   // "17:00"
        isAvailable: { type: Boolean, default: true }
    }],
    // Stripe integration
    stripeCustomerId: {
        type: String,
    },
    // User management
    isActive: {
        type: Boolean,
        default: true,
    },
    // Trainer approval
    approvedAt: {
        type: Date,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Contact info
    phoneNumber: {
        type: String,
    },
    avatar: {
        type: String,
    },

}, {
    timestamps: true,
});

// Password hashing middleware
// Password hashing middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
