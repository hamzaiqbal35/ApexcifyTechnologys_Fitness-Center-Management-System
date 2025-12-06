const SubscriptionPlan = require('../models/Plan');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Get all active subscription plans
 * @route   GET /api/subscription-plans
 * @access  Public
 */
const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ message: 'Error fetching subscription plans' });
    }
};

/**
 * @desc    Get subscription plan by ID
 * @route   GET /api/subscription-plans/:id
 * @access  Public
 */
const getSubscriptionPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Error fetching subscription plan:', error);
        res.status(500).json({ message: 'Error fetching subscription plan' });
    }
};

/**
 * @desc    Create new subscription plan (Admin)
 * @route   POST /api/subscription-plans
 * @access  Private/Admin
 */
const createSubscriptionPlan = async (req, res) => {
    try {
        const { name, description, price, interval, features, classesPerMonth } = req.body;

        // Create product in Stripe
        const product = await stripe.products.create({
            name,
            description,
        });

        // Create price in Stripe
        const stripePrice = await stripe.prices.create({
            product: product.id,
            unit_amount: price * 100, // Stripe requires cents (paisa)
            currency: 'pkr',
            recurring: {
                interval,
            },
        });

        // Create plan in database
        // Store price in Rupees as requested by user
        const plan = await SubscriptionPlan.create({
            name,
            description,
            price: price,
            interval,
            stripePriceId: stripePrice.id,
            stripeProductId: product.id,
            features,
            classesPerMonth,
        });

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'create_subscription_plan',
            resource: 'SubscriptionPlan',
            resourceId: plan._id,
            details: {
                planName: name,
                price,
            },
            ipAddress: req.ip,
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('Error creating subscription plan:', error);
        res.status(500).json({ message: 'Error creating subscription plan' });
    }
};

/**
 * @desc    Update subscription plan (Admin)
 * @route   PUT /api/subscription-plans/:id
 * @access  Private/Admin
 */
const updateSubscriptionPlan = async (req, res) => {
    try {
        const { name, description, features, classesPerMonth, isActive, price } = req.body;

        const plan = await SubscriptionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        // Update Stripe product if name or description changed
        if (name || description) {
            await stripe.products.update(plan.stripeProductId, {
                name: name || plan.name,
                description: description || plan.description,
            });
        }

        // Handle Price Change
        // Compare new price (Rupees) with stored price (Rupees)
        if (price) {

            if (Number(price) !== Number(plan.price)) {
                // Create new price in Stripe (Convert Rupees to Cents/Paisa)
                const newStripePrice = await stripe.prices.create({
                    product: plan.stripeProductId,
                    unit_amount: price * 100,
                    currency: 'pkr',
                    recurring: {
                        interval: plan.interval, // Keep same interval
                    },
                });

                // Update plan with new price info (Store in Rupees)
                plan.price = price;
                plan.stripePriceId = newStripePrice.id;

                // Note: Existing subscriptions will continue on the old price ID 
                // until they are explicitly updated or cancelled.
            }
        }

        // Update plan in database
        if (name) plan.name = name;
        if (description) plan.description = description;
        if (features) plan.features = features;
        if (classesPerMonth !== undefined) plan.classesPerMonth = classesPerMonth;
        if (isActive !== undefined) plan.isActive = isActive;

        await plan.save();

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'update_subscription_plan',
            resource: 'SubscriptionPlan',
            resourceId: plan._id,
            details: req.body,
            ipAddress: req.ip,
        });

        res.json(plan);
    } catch (error) {
        console.error('Error updating subscription plan:', error);
        res.status(500).json({ message: 'Error updating subscription plan' });
    }
};

/**
 * @desc    Soft delete subscription plan (Admin)
 * @route   DELETE /api/subscription-plans/:id
 * @access  Private/Admin
 */
const deleteSubscriptionPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        // Soft delete by setting isActive to false
        plan.isActive = false;
        await plan.save();

        // Archive product in Stripe
        await stripe.products.update(plan.stripeProductId, {
            active: false,
        });

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'delete_subscription_plan',
            resource: 'SubscriptionPlan',
            resourceId: plan._id,
            details: {
                planName: plan.name,
            },
            ipAddress: req.ip,
        });

        res.json({ message: 'Subscription plan deactivated successfully' });
    } catch (error) {
        console.error('Error deleting subscription plan:', error);
        res.status(500).json({ message: 'Error deleting subscription plan' });
    }
};

module.exports = {
    getSubscriptionPlans,
    getSubscriptionPlan,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
};
