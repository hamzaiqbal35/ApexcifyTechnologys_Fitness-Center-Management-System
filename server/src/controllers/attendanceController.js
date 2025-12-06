const Attendance = require('../models/Attendance');
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { validateToken } = require('../utils/qrService');

/**
 * @desc    QR-based check-in
 * @route   POST /api/attendance/checkin
 * @access  Private/Member
 */
const checkInWithQR = async (req, res) => {
    try {
        const { bookingId, token } = req.body;

        // Validate token
        const validation = await validateToken(token, bookingId);

        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        // Get booking details
        const booking = await Booking.findById(bookingId).populate('classId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify booking belongs to user
        if (booking.memberId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if already checked in
        const existingAttendance = await Attendance.findOne({ bookingId });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in' });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            bookingId,
            memberId: req.user._id,
            classId: booking.classId._id,
            method: 'qr',
        });

        // Update booking status
        booking.status = 'checked_in';
        await booking.save();

        // Create notification
        await Notification.create({
            userId: req.user._id,
            type: 'checked_in',
            title: 'Checked In',
            message: `You have successfully checked in to "${booking.classId.name}".`,
        });

        res.json({ message: 'Checked in successfully', attendance });
    } catch (error) {
        console.error('Error checking in:', error);
        res.status(500).json({ message: 'Error checking in' });
    }
};

/**
 * @desc    Manual check-in by trainer
 * @route   POST /api/attendance/manual
 * @access  Private/Trainer
 */
const manualCheckIn = async (req, res) => {
    try {
        const { classId, memberId } = req.body;

        // Get class details
        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify trainer owns this class
        if (classData.trainerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Find booking
        const booking = await Booking.findOne({
            classId,
            memberId,
            status: { $in: ['booked', 'checked_in'] },
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found for this member' });
        }

        // Check if already checked in
        const existingAttendance = await Attendance.findOne({ bookingId: booking._id });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Member already checked in' });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            bookingId: booking._id,
            memberId,
            classId,
            method: 'manual',
            checkedInBy: req.user._id,
        });

        // Update booking status
        booking.status = 'checked_in';
        await booking.save();

        // Create audit log
        await AuditLog.create({
            userId: req.user._id,
            action: 'manual_checkin',
            resource: 'Attendance',
            resourceId: attendance._id,
            details: { classId, memberId },
            ipAddress: req.ip,
        });

        res.json({ message: 'Member checked in successfully', attendance });
    } catch (error) {
        console.error('Error with manual check-in:', error);
        res.status(500).json({ message: 'Error with manual check-in' });
    }
};

/**
 * @desc    Get class attendance
 * @route   GET /api/attendance/class/:classId
 * @access  Private/Trainer/Admin
 */
const getClassAttendance = async (req, res) => {
    try {
        const { classId } = req.params;

        // Get class details
        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify authorization (trainer owns class or admin)
        if (
            req.user.role !== 'admin' &&
            classData.trainerId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get all attendance records
        const attendance = await Attendance.find({ classId })
            .populate('memberId', 'name email')
            .populate('checkedInBy', 'name')
            .sort({ checkedInAt: 1 });

        // Get all bookings for this class
        const bookings = await Booking.find({ classId }).populate('memberId', 'name email');

        // Calculate stats
        const stats = {
            totalBookings: bookings.length,
            checkedIn: attendance.length,
            noShows: bookings.filter(b => b.status === 'no_show').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            qrCheckIns: attendance.filter(a => a.method === 'qr').length,
            manualCheckIns: attendance.filter(a => a.method === 'manual').length,
        };

        res.json({
            attendance,
            bookings,
            stats,
        });
    } catch (error) {
        console.error('Error fetching class attendance:', error);
        res.status(500).json({ message: 'Error fetching class attendance' });
    }
};

/**
 * @desc    Get member attendance history
 * @route   GET /api/attendance/member/:memberId
 * @access  Private/Member/Admin
 */
const getMemberAttendance = async (req, res) => {
    try {
        const { memberId } = req.params;

        // Verify authorization (member viewing own or admin)
        if (req.user.role !== 'admin' && req.user._id.toString() !== memberId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const attendance = await Attendance.find({ memberId })
            .populate('classId', 'name startTime')
            .populate('checkedInBy', 'name')
            .sort({ checkedInAt: -1 });

        // Calculate stats
        const stats = {
            totalClasses: attendance.length,
            qrCheckIns: attendance.filter(a => a.method === 'qr').length,
            manualCheckIns: attendance.filter(a => a.method === 'manual').length,
        };

        res.json({
            attendance,
            stats,
        });
    } catch (error) {
        console.error('Error fetching member attendance:', error);
        res.status(500).json({ message: 'Error fetching member attendance' });
    }
};

module.exports = {
    checkInWithQR,
    manualCheckIn,
    getClassAttendance,
    getMemberAttendance,
};
