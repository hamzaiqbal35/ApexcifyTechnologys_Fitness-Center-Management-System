const cron = require('node-cron');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendClassReminder } = require('./emailService');
const AuditLog = require('../models/AuditLog');

/**
 * Send class reminders (24 hours and 1 hour before)
 * Runs every hour
 */
const classReminderJob = cron.schedule('0 * * * *', async () => {
    console.log('Running class reminder job...');

    try {
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in1Hour = new Date(now.getTime() + 1 * 60 * 60 * 1000);

        // Find classes starting in 24 hours (±30 minutes window)
        const classes24h = await Class.find({
            startTime: {
                $gte: new Date(in24Hours.getTime() - 30 * 60 * 1000),
                $lte: new Date(in24Hours.getTime() + 30 * 60 * 1000),
            },
            status: 'scheduled',
        }).populate('trainerId', 'name');

        // Find classes starting in 1 hour (±15 minutes window)
        const classes1h = await Class.find({
            startTime: {
                $gte: new Date(in1Hour.getTime() - 15 * 60 * 1000),
                $lte: new Date(in1Hour.getTime() + 15 * 60 * 1000),
            },
            status: 'scheduled',
        }).populate('trainerId', 'name');

        // Send 24-hour reminders
        for (const classData of classes24h) {
            const bookings = await Booking.find({
                classId: classData._id,
                status: 'booked',
            }).populate('memberId', 'name email');

            for (const booking of bookings) {
                await sendClassReminder(
                    booking,
                    {
                        name: classData.name,
                        trainerName: classData.trainerId.name,
                        startTime: classData.startTime,
                        location: classData.location,
                    },
                    booking.memberId,
                    24
                );
            }
        }

        // Send 1-hour reminders
        for (const classData of classes1h) {
            const bookings = await Booking.find({
                classId: classData._id,
                status: 'booked',
            }).populate('memberId', 'name email');

            for (const booking of bookings) {
                await sendClassReminder(
                    booking,
                    {
                        name: classData.name,
                        trainerName: classData.trainerId.name,
                        startTime: classData.startTime,
                        location: classData.location,
                    },
                    booking.memberId,
                    1
                );
            }
        }

        console.log(`Sent reminders for ${classes24h.length} classes (24h) and ${classes1h.length} classes (1h)`);
    } catch (error) {
        console.error('Error in class reminder job:', error);
    }
});

/**
 * Payment reconciliation job
 * Runs daily at 2 AM
 */
const paymentReconciliationJob = cron.schedule('0 2 * * *', async () => {
    console.log('Running payment reconciliation job...');
    await runReconciliation();
});

/**
 * Run payment reconciliation (can be called manually)
 */
const runReconciliation = async () => {
    try {
        // Get all unreconciled payments from last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const payments = await Payment.find({
            reconciled: false,
            createdAt: { $gte: thirtyDaysAgo },
            stripePaymentIntentId: { $exists: true },
        });

        let reconciledCount = 0;
        let discrepancyCount = 0;

        for (const payment of payments) {
            try {
                // Fetch payment intent from Stripe
                const paymentIntent = await stripe.paymentIntents.retrieve(
                    payment.stripePaymentIntentId
                );

                // Check if amounts match
                if (paymentIntent.amount === payment.amount) {
                    // Mark as reconciled
                    payment.reconciled = true;
                    payment.reconciledAt = new Date();
                    await payment.save();
                    reconciledCount++;
                } else {
                    // Log discrepancy
                    await AuditLog.create({
                        userId: payment.userId,
                        action: 'payment_discrepancy',
                        resource: 'Payment',
                        resourceId: payment._id,
                        details: {
                            localAmount: payment.amount,
                            stripeAmount: paymentIntent.amount,
                            paymentIntentId: payment.stripePaymentIntentId,
                        },
                    });
                    discrepancyCount++;
                }
            } catch (error) {
                console.error(`Error reconciling payment ${payment._id}:`, error);
            }
        }

        console.log(`Reconciliation complete: ${reconciledCount} reconciled, ${discrepancyCount} discrepancies found`);
    } catch (error) {
        console.error('Error in payment reconciliation:', error);
    }
};

/**
 * Initialize all cron jobs
 */
const initCronJobs = () => {
    console.log('Initializing cron jobs...');
    classReminderJob.start();
    paymentReconciliationJob.start();
    console.log('Cron jobs initialized');
};

module.exports = {
    initCronJobs,
    runReconciliation,
};
