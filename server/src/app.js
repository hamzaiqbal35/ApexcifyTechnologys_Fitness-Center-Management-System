const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Raw body parser for Stripe webhooks (must be before express.json())
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/plans', require('./routes/planRoutes')); // Workout/Diet plans (old)
app.use('/api/payments', require('./routes/paymentRoutes'));

// New routes for FitTrack
app.use('/api/subscription-plans', require('./routes/subscriptionPlanRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/workout-plans', require('./routes/workoutPlanRoutes'));
app.use('/api/diet-plans', require('./routes/dietPlanRoutes'));



app.get('/', (req, res) => {
    res.send('FitTrack API is running...');
});

module.exports = app;

