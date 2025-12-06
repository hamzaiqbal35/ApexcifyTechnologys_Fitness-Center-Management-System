const User = require('../models/User');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const AuditLog = require('../models/AuditLog');
const Plan = require('../models/Plan');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Get platform dashboard KPIs
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboard = async (req, res) => {
    try {
        // Get total revenue
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        // Get active subscriptions count
        const activeSubscriptions = await Subscription.countDocuments({
            status: { $in: ['active', 'trialing', 'incomplete'] },
        });

        // Get total members count
        const totalMembers = await User.countDocuments({ role: 'member' });

        // Get today's classes
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayClasses = await Class.countDocuments({
            startTime: { $gte: today, $lt: tomorrow },
            status: 'scheduled',
        });

        // Get revenue for last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const revenueByDay = await Payment.aggregate([
            {
                $match: {
                    status: 'paid',
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Get recent bookings
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('memberId', 'name email')
            .populate('classId', 'name startTime');

        res.json({
            kpis: {
                totalRevenue: totalRevenue[0]?.total || 0,
                activeSubscriptions,
                totalMembers,
                todayClasses,
            },
            revenueByDay,
            recentBookings,
        });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
    try {
        const { role, search, isActive, page = 1, limit = 20 } = req.query;

        const query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

/**
 * @desc    Suspend user
 * @route   PUT /api/admin/users/:id/suspend
 * @access  Private/Admin
 */
const suspendUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        // Create audit log
        try {
            await AuditLog.create({
                userId: req.user._id,
                action: 'suspend_user',
                resource: 'User',
                resourceId: user._id,
                details: {
                    suspendedUser: user.email,
                },
                ipAddress: req.ip,
            });
        } catch (auditError) {
            console.error("Audit log failed:", auditError);
        }

        res.json({ message: 'User suspended successfully', user });
    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({ message: 'Error suspending user' });
    }
};

/**
 * @desc    Activate user
 * @route   PUT /api/admin/users/:id/activate
 * @access  Private/Admin
 */
const activateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        // Create audit log
        try {
            await AuditLog.create({
                userId: req.user._id,
                action: 'activate_user',
                resource: 'User',
                resourceId: user._id,
                details: {
                    activatedUser: user.email,
                },
                ipAddress: req.ip,
            });
        } catch (auditError) {
            console.error("Audit log failed:", auditError);
        }

        res.json({ message: 'User activated successfully', user });
    } catch (error) {
        console.error('Error activating user:', error);
        res.status(500).json({ message: 'Error activating user' });
    }
};

/**
 * @desc    Approve trainer
 * @route   PUT /api/admin/trainers/:id/approve
 * @access  Private/Admin
 */
const approveTrainer = async (req, res) => {
    try {
        const trainer = await User.findById(req.params.id);

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        if (trainer.role !== 'trainer') {
            return res.status(400).json({ message: 'User is not a trainer' });
        }

        trainer.approvedAt = new Date();
        trainer.approvedBy = req.user._id;
        trainer.isActive = true;
        await trainer.save();

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'approve_trainer',
            resource: 'User',
            resourceId: trainer._id,
            details: {
                trainerEmail: trainer.email,
            },
            ipAddress: req.ip,
        });

        res.json({ message: 'Trainer approved successfully', trainer });
    } catch (error) {
        console.error('Error approving trainer:', error);
        res.status(500).json({ message: 'Error approving trainer' });
    }
};

/**
 * @desc    Get all payments with filters
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
const getPayments = async (req, res) => {
    try {
        const { status, reconciled, startDate, endDate, page = 1, limit = 20 } = req.query;

        const query = {};

        if (status) query.status = status;
        if (reconciled !== undefined) query.reconciled = reconciled === 'true';
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const payments = await Payment.find(query)
            .populate('userId', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Payment.countDocuments(query);

        res.json({
            payments,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Error fetching payments' });
    }
};

/**
 * @desc    Issue refund
 * @route   POST /api/admin/payments/:id/refund
 * @access  Private/Admin
 */
const refundPayment = async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.status !== 'paid') {
            return res.status(400).json({ message: 'Can only refund paid payments' });
        }

        if (!payment.stripePaymentIntentId) {
            return res.status(400).json({ message: 'No Stripe payment intent found' });
        }

        // Create refund in Stripe
        let intentId = payment.stripePaymentIntentId;

        // If ID is an Invoice (starts with 'in_'), retrieve the Payment Intent from it
        if (intentId && intentId.startsWith('in_')) {
            try {
                const invoice = await stripe.invoices.retrieve(intentId);
                intentId = invoice.payment_intent;
            } catch (err) {
                console.warn("Could not retrieve invoice for refund:", err.message);
                // Fallback: try using it directly or fail if invalid
            }
        }

        const refund = await stripe.refunds.create({
            payment_intent: intentId,
        });

        // Update payment record
        payment.status = 'refunded';
        payment.refundedAt = new Date();
        payment.refundReason = reason;
        await payment.save();

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'refund_payment',
            resource: 'Payment',
            resourceId: payment._id,
            details: {
                amount: payment.amount,
                reason,
                refundId: refund.id,
            },
            ipAddress: req.ip,
        });

        res.json({ message: 'Payment refunded successfully', payment, refund });
    } catch (error) {
        console.error('Error refunding payment:', error);
        res.status(500).json({ message: 'Error processing refund' });
    }
};

/**
 * @desc    Mark manual payment as paid
 * @route   POST /api/admin/payments/:id/mark-paid
 * @access  Private/Admin
 */
const markPaymentPaid = async (req, res) => {
    try {
        const { paymentMethod, description } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = 'paid';
        payment.paymentMethod = paymentMethod || 'manual';
        payment.description = description;
        await payment.save();

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'mark_payment_paid',
            resource: 'Payment',
            resourceId: payment._id,
            details: {
                amount: payment.amount,
                paymentMethod,
                description,
            },
            ipAddress: req.ip,
        });

        res.json({ message: 'Payment marked as paid', payment });
    } catch (error) {
        console.error('Error marking payment:', error);
        res.status(500).json({ message: 'Error marking payment' });
    }
};

/**
 * @desc    Get revenue report
 * @route   GET /api/admin/reports/revenue
 * @access  Private/Admin
 */
const getRevenueReport = async (req, res) => {
    try {
        const { period = 'monthly', startDate, endDate } = req.query;

        let groupFormat;
        switch (period) {
            case 'daily':
                groupFormat = '%Y-%m-%d';
                break;
            case 'weekly':
                groupFormat = '%Y-W%V';
                break;
            case 'monthly':
            default:
                groupFormat = '%Y-%m';
                break;
        }

        const matchQuery = { status: 'paid' };
        if (startDate || endDate) {
            matchQuery.createdAt = {};
            if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
            if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
        }

        const revenue = await Payment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ revenue });
    } catch (error) {
        console.error('Error fetching revenue report:', error);
        res.status(500).json({ message: 'Error fetching revenue report' });
    }
};

/**
 * @desc    Grant manual subscription to user
 * @route   POST /api/admin/users/:id/grant-subscription
 * @access  Private/Admin
 */
const grantSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find any active plan
        const plan = await Plan.findOne({ isActive: true });

        if (!plan) {
            // Create a dummy plan if none exists (fallback for testing)
            // But ideally we should ask user to create one. For now, let's error if no plan.
            return res.status(404).json({ message: 'No active plans found. Please create a plan first.' });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month duration

        // Create subscription
        const subscription = await Subscription.create({
            userId: user._id,
            planId: plan._id,
            stripeCustomerId: 'manual_grant_' + user._id,
            stripeSubscriptionId: 'sub_manual_' + Date.now(),
            status: 'active',
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false
        });

        // Audit log
        try {
            await AuditLog.create({
                userId: req.user._id,
                action: 'grant_subscription',
                resource: 'User',
                resourceId: user._id,
                details: {
                    planName: plan.name,
                    subscriptionId: subscription._id
                },
                ipAddress: req.ip,
            });
        } catch (auditError) {
            console.error("Audit log failed:", auditError);
        }

        res.json({ message: 'Subscription granted successfully', subscription });
    } catch (error) {
        console.error('Error granting subscription:', error);
        res.status(500).json({ message: 'Error granting subscription' });
    }
};

/**
 * @desc    Get attendance report
 * @route   GET /api/admin/reports/attendance
 * @access  Private/Admin
 */
const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchQuery = {};
        if (startDate || endDate) {
            matchQuery.checkedInAt = {};
            if (startDate) matchQuery.checkedInAt.$gte = new Date(startDate);
            if (endDate) matchQuery.checkedInAt.$lte = new Date(endDate);
        }

        const Attendance = require('../models/Attendance');

        const attendanceData = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkedInAt' } },
                    count: { $sum: 1 },
                    qrCount: {
                        $sum: { $cond: [{ $eq: ['$method', 'qr'] }, 1, 0] },
                    },
                    manualCount: {
                        $sum: { $cond: [{ $eq: ['$method', 'manual'] }, 1, 0] },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ attendance: attendanceData });
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).json({ message: 'Error fetching attendance report' });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    suspendUser,
    activateUser,
    approveTrainer,
    grantSubscription,
    getPayments,
    refundPayment,
    markPaymentPaid,
    getRevenueReport,
    getAttendanceReport,
};
