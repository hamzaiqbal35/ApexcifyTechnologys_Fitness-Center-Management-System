const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { sendSubscriptionConfirmation, sendPaymentFailure, sendPaymentReceipt } = require('../utils/emailService');
const User = require('../models/User');
const Plan = require('../models/Plan');

// Store processed event IDs to prevent duplicate processing
const processedEvents = new Set();

/**
 * @desc    Handle Stripe webhooks
 * @route   POST /api/webhooks/stripe
 * @access  Public (but verified via Stripe signature)
 */
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Check if event was already processed (idempotency)
    if (processedEvents.has(event.id)) {
        console.log(`Event ${event.id} already processed, skipping`);
        return res.json({ received: true, skipped: true });
    }

    console.log(`Processing webhook event: ${event.type}`);

    try {
        // Handle different event types
        switch (event.type) {
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;

            case 'charge.refunded':
                await handleChargeRefunded(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Mark event as processed
        processedEvents.add(event.id);

        // Clean up old event IDs (keep last 1000)
        if (processedEvents.size > 1000) {
            const eventsArray = Array.from(processedEvents);
            processedEvents.clear();
            eventsArray.slice(-500).forEach(id => processedEvents.add(id));
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        // Return 200 to prevent Stripe from retrying
        res.json({ received: true, error: error.message });
    }
};

/**
 * Handle successful invoice payment
 */
const handleInvoicePaymentSucceeded = async (invoice) => {
    try {
        const subscriptionId = invoice.subscription;

        // Find subscription in database
        const subscription = await Subscription.findOne({
            stripeSubscriptionId: subscriptionId,
        }).populate('planId userId');

        if (!subscription) {
            console.error('Subscription not found for invoice:', invoice.id);
            return;
        }

        // Update subscription status
        subscription.status = 'active';
        await subscription.save();

        // Create payment record
        await Payment.create({
            userId: subscription.userId._id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'paid',
            stripePaymentIntentId: invoice.payment_intent,
            stripeInvoiceId: invoice.id,
            subscriptionId: subscription._id,
            description: `Subscription payment for ${subscription.planId.name}`,
        });

        // Create notification
        await Notification.create({
            userId: subscription.userId._id,
            type: 'payment_succeeded',
            title: 'Payment Successful',
            message: `Your payment of $${(invoice.amount_paid / 100).toFixed(2)} was successful.`,
        });

        // Send confirmation email
        await sendSubscriptionConfirmation(
            subscription,
            subscription.planId,
            subscription.userId
        );

        console.log(`Invoice payment succeeded for subscription ${subscriptionId}`);
    } catch (error) {
        console.error('Error handling invoice payment succeeded:', error);
    }
};

/**
 * Handle failed invoice payment
 */
const handleInvoicePaymentFailed = async (invoice) => {
    try {
        const subscriptionId = invoice.subscription;

        // Find subscription in database
        const subscription = await Subscription.findOne({
            stripeSubscriptionId: subscriptionId,
        }).populate('userId');

        if (!subscription) {
            console.error('Subscription not found for invoice:', invoice.id);
            return;
        }

        // Update subscription status
        subscription.status = 'past_due';
        await subscription.save();

        // Create notification
        await Notification.create({
            userId: subscription.userId._id,
            type: 'payment_failed',
            title: 'Payment Failed',
            message: 'Your recent payment failed. Please update your payment method.',
        });

        // Send failure email
        await sendPaymentFailure(subscription, subscription.userId);

        console.log(`Invoice payment failed for subscription ${subscriptionId}`);
    } catch (error) {
        console.error('Error handling invoice payment failed:', error);
    }
};

/**
 * Handle subscription deletion
 */
const handleSubscriptionDeleted = async (stripeSubscription) => {
    try {
        const subscription = await Subscription.findOne({
            stripeSubscriptionId: stripeSubscription.id,
        });

        if (!subscription) {
            console.error('Subscription not found:', stripeSubscription.id);
            return;
        }

        // Update subscription status
        subscription.status = 'cancelled';
        subscription.cancelledAt = new Date();
        await subscription.save();

        // Create notification
        await Notification.create({
            userId: subscription.userId,
            type: 'subscription_cancelled',
            title: 'Subscription Cancelled',
            message: 'Your subscription has been cancelled.',
        });

        console.log(`Subscription deleted: ${stripeSubscription.id}`);
    } catch (error) {
        console.error('Error handling subscription deleted:', error);
    }
};

/**
 * Handle subscription update
 */
const handleSubscriptionUpdated = async (stripeSubscription) => {
    try {
        const subscription = await Subscription.findOne({
            stripeSubscriptionId: stripeSubscription.id,
        });

        if (!subscription) {
            console.error('Subscription not found:', stripeSubscription.id);
            return;
        }

        // Update subscription details
        subscription.status = stripeSubscription.status;
        subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
        subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
        subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

        await subscription.save();

        console.log(`Subscription updated: ${stripeSubscription.id}`);
    } catch (error) {
        console.error('Error handling subscription updated:', error);
    }
};

/**
 * Handle successful payment intent (one-off payments)
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
    try {
        // Check if payment already exists
        const existingPayment = await Payment.findOne({
            stripePaymentIntentId: paymentIntent.id,
        });

        if (existingPayment) {
            console.log('Payment already recorded:', paymentIntent.id);
            return;
        }

        // Get customer ID and find user
        const customerId = paymentIntent.customer;
        const user = await User.findOne({ stripeCustomerId: customerId });

        if (!user) {
            console.error('User not found for customer:', customerId);
            return;
        }

        // Create payment record
        const payment = await Payment.create({
            userId: user._id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'paid',
            stripePaymentIntentId: paymentIntent.id,
            description: paymentIntent.description || 'One-time payment',
        });

        // Send receipt
        await sendPaymentReceipt(payment, user);

        console.log(`Payment intent succeeded: ${paymentIntent.id}`);
    } catch (error) {
        console.error('Error handling payment intent succeeded:', error);
    }
};

/**
 * Handle charge refund
 */
const handleChargeRefunded = async (charge) => {
    try {
        const payment = await Payment.findOne({
            stripePaymentIntentId: charge.payment_intent,
        });

        if (!payment) {
            console.error('Payment not found for charge:', charge.id);
            return;
        }

        // Update payment status
        payment.status = 'refunded';
        payment.refundedAt = new Date();
        await payment.save();

        // Create notification
        await Notification.create({
            userId: payment.userId,
            type: 'payment_refunded',
            title: 'Payment Refunded',
            message: `Your payment of $${(charge.amount / 100).toFixed(2)} has been refunded.`,
        });

        console.log(`Charge refunded: ${charge.id}`);
    } catch (error) {
        console.error('Error handling charge refunded:', error);
    }
};

module.exports = {
    handleStripeWebhook,
};
