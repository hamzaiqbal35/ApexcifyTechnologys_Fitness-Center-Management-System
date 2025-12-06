const crypto = require('crypto');
const AttendanceToken = require('../models/AttendanceToken');

/**
 * Generate a secure QR token for attendance check-in
 * @param {String} bookingId - Booking ID
 * @param {String} classId - Class ID
 * @param {String} memberId - Member ID
 * @returns {Object} - { token, tokenHash, expiresAt }
 */
const generateToken = async (bookingId, classId, memberId) => {
    // Generate cryptographically secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Hash the token for storage
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Set expiry (30 minutes from now)
    const expiryMinutes = parseInt(process.env.QR_TOKEN_EXPIRY_MINUTES) || 30;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Store token hash in database
    await AttendanceToken.create({
        tokenHash,
        bookingId,
        classId,
        memberId,
        expiresAt,
    });

    return {
        token,
        tokenHash,
        expiresAt,
    };
};

/**
 * Validate and consume a QR token
 * @param {String} token - Raw token from QR code
 * @param {String} bookingId - Booking ID to validate against
 * @returns {Object} - { valid, message, tokenData }
 */
const validateToken = async (token, bookingId) => {
    try {
        // Hash the provided token
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find the token in database
        const tokenData = await AttendanceToken.findOne({
            tokenHash,
            bookingId,
        });

        if (!tokenData) {
            return {
                valid: false,
                message: 'Invalid token or booking ID',
            };
        }

        // Check if already used
        if (tokenData.used) {
            return {
                valid: false,
                message: 'Token has already been used',
            };
        }

        // Check if expired
        if (new Date() > tokenData.expiresAt) {
            return {
                valid: false,
                message: 'Token has expired',
            };
        }

        // Mark token as used atomically
        const updatedToken = await AttendanceToken.findOneAndUpdate(
            {
                tokenHash,
                used: false,
            },
            {
                used: true,
                usedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedToken) {
            return {
                valid: false,
                message: 'Token was already used (race condition)',
            };
        }

        return {
            valid: true,
            message: 'Token validated successfully',
            tokenData: updatedToken,
        };
    } catch (error) {
        console.error('Error validating token:', error);
        return {
            valid: false,
            message: 'Error validating token',
        };
    }
};

module.exports = {
    generateToken,
    validateToken,
};
