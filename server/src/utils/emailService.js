const nodemailer = require('nodemailer');

// Email queue (in-memory for now, can upgrade to Bull/Redis later)
const emailQueue = [];
let isProcessing = false;

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Add email to queue and process
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} html - Email HTML content
 */
const sendEmail = async (to, subject, html) => {
    emailQueue.push({ to, subject, html });
    processQueue();
};

/**
 * Process email queue
 */
const processQueue = async () => {
    if (isProcessing || emailQueue.length === 0) return;

    isProcessing = true;

    while (emailQueue.length > 0) {
        const email = emailQueue.shift();

        try {
            await transporter.sendMail({
                from: `"FitTrack" <${process.env.EMAIL_USER}>`,
                to: email.to,
                subject: email.subject,
                html: email.html,
            });
            console.log(`Email sent to ${email.to}: ${email.subject}`);
        } catch (error) {
            console.error(`Failed to send email to ${email.to}:`, error);
            // Optionally: retry logic or dead letter queue
        }
    }

    isProcessing = false;
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async (booking, classData, userData) => {
    const subject = 'Booking Confirmation - FitTrack';
    const html = `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${userData.name},</p>
        <p>Your booking for <strong>${classData.name}</strong> has been confirmed.</p>
        <p><strong>Details:</strong></p>
        <ul>
            <li>Class: ${classData.name}</li>
            <li>Trainer: ${classData.trainerName}</li>
            <li>Date & Time: ${new Date(classData.startTime).toLocaleString()}</li>
            <li>Location: ${classData.location}</li>
        </ul>
        <p>Don't forget to generate your QR code for check-in!</p>
        <p>See you there!</p>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(userData.email, subject, html);
};

/**
 * Send class reminder email
 */
const sendClassReminder = async (booking, classData, userData, hours) => {
    const subject = `Reminder: Class in ${hours} hour${hours > 1 ? 's' : ''} - FitTrack`;
    const html = `
        <h2>Class Reminder</h2>
        <p>Hi ${userData.name},</p>
        <p>This is a reminder that your class <strong>${classData.name}</strong> starts in ${hours} hour${hours > 1 ? 's' : ''}.</p>
        <p><strong>Details:</strong></p>
        <ul>
            <li>Class: ${classData.name}</li>
            <li>Trainer: ${classData.trainerName}</li>
            <li>Date & Time: ${new Date(classData.startTime).toLocaleString()}</li>
            <li>Location: ${classData.location}</li>
        </ul>
        <p>Make sure to generate your QR code for check-in!</p>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(userData.email, subject, html);
};

/**
 * Send payment receipt email
 */
const sendPaymentReceipt = async (payment, userData) => {
    const subject = 'Payment Receipt - FitTrack';
    const html = `
        <h2>Payment Receipt</h2>
        <p>Hi ${userData.name},</p>
        <p>Thank you for your payment!</p>
        <p><strong>Payment Details:</strong></p>
        <ul>
            <li>Amount: $${(payment.amount / 100).toFixed(2)}</li>
            <li>Status: ${payment.status}</li>
            <li>Date: ${new Date(payment.createdAt).toLocaleString()}</li>
            <li>Payment ID: ${payment._id}</li>
        </ul>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(userData.email, subject, html);
};

/**
 * Send subscription confirmation email
 */
const sendSubscriptionConfirmation = async (subscription, planData, userData) => {
    const subject = 'Subscription Confirmed - FitTrack';
    const html = `
        <h2>Subscription Confirmed!</h2>
        <p>Hi ${userData.name},</p>
        <p>Your subscription to <strong>${planData.name}</strong> is now active!</p>
        <p><strong>Subscription Details:</strong></p>
        <ul>
            <li>Plan: ${planData.name}</li>
            <li>Price: $${(planData.price / 100).toFixed(2)}/${planData.interval}</li>
            <li>Next billing date: ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}</li>
        </ul>
        <p>You can now book classes and access all member benefits!</p>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(userData.email, subject, html);
};

/**
 * Send payment failure email
 */
const sendPaymentFailure = async (subscription, userData) => {
    const subject = 'Payment Failed - Action Required - FitTrack';
    const html = `
        <h2>Payment Failed</h2>
        <p>Hi ${userData.name},</p>
        <p>We were unable to process your recent payment for your FitTrack subscription.</p>
        <p>Please update your payment method to continue enjoying our services.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(userData.email, subject, html);
};

/**
 * Send booking cancellation email
 */
const sendBookingCancellation = async (booking, classData, userData) => {
    const subject = 'Booking Cancelled - FitTrack';
    const html = `
        <h2>Booking Cancelled</h2>
        <p>Hi ${userData.name},</p>
        <p>Your booking for <strong>${classData.name}</strong> has been cancelled.</p>
        <p><strong>Class Details:</strong></p>
        <ul>
            <li>Class: ${classData.name}</li>
            <li>Date & Time: ${new Date(classData.startTime).toLocaleString()}</li>
        </ul>
        <p>You can book another class anytime from your dashboard.</p>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(userData.email, subject, html);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
    const subject = 'Password Reset Request - FitTrack';
    const html = `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please go to this link to reset your password:</p>
        <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
        <p>If you did not request this email, please ignore it.</p>
        <p>- FitTrack Team</p>
    `;

    await sendEmail(email, subject, html);
};

module.exports = {
    sendEmail,
    sendBookingConfirmation,
    sendClassReminder,
    sendPaymentReceipt,
    sendSubscriptionConfirmation,
    sendPaymentFailure,
    sendBookingCancellation,
    sendPasswordResetEmail,
};
