const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            req.user = await User.findById(decoded.id).select('-password');

            // Check if user is active
            if (!req.user.isActive) {
                return res.status(403).json({
                    message: 'Your account has been suspended. Please contact support.'
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

/**
 * Middleware to check if user has an active subscription
 * Use for member-only features like booking classes
 */
const requireActiveSubscription = async (req, res, next) => {
    try {
        // Admins and trainers bypass this check
        if (req.user.role === 'admin' || req.user.role === 'trainer') {
            return next();
        }

        const activeSubscription = await Subscription.findOne({
            userId: req.user._id,
            status: { $in: ['active', 'trialing'] },
            currentPeriodEnd: { $gte: new Date() },
        });

        if (!activeSubscription) {
            console.log(`Debug: Subscription check failed for user ${req.user._id}`);
            // Check what DOES exist for this user?
            const anySub = await Subscription.findOne({ userId: req.user._id });
            console.log('Debug: Found any sub:', anySub);

            return res.status(403).json({
                message: 'Active subscription required to access this feature',
            });
        }

        req.subscription = activeSubscription;
        next();
    } catch (error) {
        console.error('Error checking subscription:', error);
        res.status(500).json({ message: 'Error verifying subscription' });
    }
};

module.exports = { protect, authorize, requireActiveSubscription };

