const Booking = require('../models/Booking');
const Class = require('../models/Class');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { sendBookingConfirmation, sendBookingCancellation } = require('../utils/emailService');

/**
 * @desc    Book a class with atomic capacity check
 * @route   POST /api/classes/:classId/book
 * @access  Private/Member
 */
const bookClass = async (req, res) => {
    try {
        const { classId } = req.params;

        // Check if already booked
        const existingBooking = await Booking.findOne({
            memberId: req.user._id,
            classId,
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this class' });
        }

        // Get class details
        const classData = await Class.findById(classId).populate('trainerId', 'name');

        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (classData.status !== 'scheduled') {
            return res.status(400).json({ message: 'Class is not available for booking' });
        }

        // Atomic capacity check and booking using findOneAndUpdate
        const updatedClass = await Class.findOneAndUpdate(
            {
                _id: classId,
                status: 'scheduled',
                $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] },
            },
            {
                $addToSet: { attendees: req.user._id },
            },
            { new: true }
        );

        if (!updatedClass) {
            // Class is full, add to waitlist
            const waitlistClass = await Class.findOneAndUpdate(
                {
                    _id: classId,
                    status: 'scheduled',
                },
                {
                    $addToSet: { waitlist: req.user._id },
                },
                { new: true }
            );

            if (!waitlistClass) {
                return res.status(404).json({ message: 'Class not found' });
            }

            // Create notification
            await Notification.create({
                userId: req.user._id,
                type: 'waitlist_added',
                title: 'Added to Waitlist',
                message: `You have been added to the waitlist for "${classData.name}". We'll notify you if a spot opens up.`,
            });

            return res.status(200).json({
                message: 'Class is full. You have been added to the waitlist.',
                waitlisted: true,
            });
        }

        // Create booking record
        const booking = await Booking.create({
            memberId: req.user._id,
            classId,
            status: 'booked',
        });

        // Create notification
        await Notification.create({
            userId: req.user._id,
            type: 'booking_confirmed',
            title: 'Booking Confirmed',
            message: `Your booking for "${classData.name}" on ${classData.startTime.toLocaleString()} has been confirmed.`,
        });

        // Send confirmation email
        await sendBookingConfirmation(
            booking,
            {
                name: classData.name,
                trainerName: classData.trainerId.name,
                startTime: classData.startTime,
                location: classData.location,
            },
            req.user
        );

        res.status(201).json({ message: 'Class booked successfully', booking });
    } catch (error) {
        console.error('Error booking class:', error);
        res.status(500).json({ message: 'Error booking class' });
    }
};

/**
 * @desc    Get my bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private/Member
 */
const getMyBookings = async (req, res) => {
    try {
        const { status, upcoming } = req.query;

        const query = { memberId: req.user._id };

        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('classId')
            .populate({
                path: 'classId',
                populate: { path: 'trainerId', select: 'name specialization' },
            })
            .sort({ createdAt: -1 });

        // Filter upcoming if requested
        let filteredBookings = bookings;
        if (upcoming === 'true') {
            filteredBookings = bookings.filter(
                booking => booking.classId && new Date(booking.classId.startTime) > new Date()
            );
        }

        res.json(filteredBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private/Member
 */
const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('classId')
            .populate('memberId', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership
        if (booking.memberId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking' });
    }
};

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private/Member
 */
const cancelBooking = async (req, res) => {
    try {
        const { reason } = req.body;
        const booking = await Booking.findById(req.params.id).populate('classId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership
        if (booking.memberId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'booked') {
            return res.status(400).json({ message: 'Booking cannot be cancelled' });
        }

        // Check cancellation cutoff time
        const cancellationHours = parseInt(process.env.BOOKING_CANCELLATION_HOURS) || 2;
        const hoursUntilClass =
            (new Date(booking.classId.startTime) - new Date()) / (1000 * 60 * 60);

        if (hoursUntilClass < cancellationHours) {
            return res.status(400).json({
                message: `Cancellations must be made at least ${cancellationHours} hours before class start time`,
            });
        }

        // Remove from class attendees atomically
        await Class.findByIdAndUpdate(booking.classId._id, {
            $pull: { attendees: req.user._id },
        });

        // Update booking status
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancellationReason = reason || 'Cancelled by member';
        await booking.save();

        // Check waitlist and promote first person
        const classData = await Class.findById(booking.classId._id);
        if (classData.waitlist.length > 0) {
            const nextMemberId = classData.waitlist[0];

            // Remove from waitlist and add to attendees atomically
            await Class.findByIdAndUpdate(classData._id, {
                $pull: { waitlist: nextMemberId },
                $addToSet: { attendees: nextMemberId },
            });

            // Create booking for waitlisted member
            const newBooking = await Booking.create({
                memberId: nextMemberId,
                classId: classData._id,
                status: 'booked',
            });

            // Notify promoted member
            await Notification.create({
                userId: nextMemberId,
                type: 'waitlist_promoted',
                title: 'Spot Available!',
                message: `A spot has opened up for "${classData.name}" on ${classData.startTime.toLocaleString()}. Your booking has been confirmed!`,
            });

            // Send email to promoted member
            const promotedUser = await User.findById(nextMemberId);
            await sendBookingConfirmation(
                newBooking,
                {
                    name: classData.name,
                    trainerName: classData.trainerId?.name || 'Trainer',
                    startTime: classData.startTime,
                    location: classData.location,
                },
                promotedUser
            );
        }

        // Send cancellation email
        await sendBookingCancellation(
            booking,
            {
                name: booking.classId.name,
                startTime: booking.classId.startTime,
            },
            req.user
        );

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'cancel_booking',
            resource: 'Booking',
            resourceId: booking._id,
            details: { classId: booking.classId._id, reason },
            ipAddress: req.ip,
        });

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
};

/**
 * @desc    Generate QR token for booking
 * @route   POST /api/bookings/:id/generate-qr
 * @access  Private/Member
 */
const generateQRToken = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('classId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership
        if (booking.memberId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'booked') {
            return res.status(400).json({ message: 'Booking is not active' });
        }

        // Generate QR token
        const qrService = require('../utils/qrService');
        const { token, expiresAt } = await qrService.generateToken(
            booking._id.toString(),
            booking.classId._id.toString(),
            req.user._id.toString()
        );

        // Update booking with token expiry
        booking.qrTokenExpiry = expiresAt;
        await booking.save();

        // Generate QR URL
        const qrUrl = `${process.env.FRONTEND_URL}/checkin?c=${booking.classId._id}&b=${booking._id}&t=${token}`;

        res.json({
            token,
            qrUrl,
            expiresAt,
        });
    } catch (error) {
        console.error('Error generating QR token:', error);
        res.status(500).json({ message: 'Error generating QR token' });
    }
};

module.exports = {
    bookClass,
    getMyBookings,
    getBooking,
    cancelBooking,
    generateQRToken,
};
