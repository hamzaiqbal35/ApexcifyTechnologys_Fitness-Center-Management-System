const Booking = require('../models/Booking');
const Class = require('../models/Class');

// @desc    Book a class
// @route   POST /api/bookings
// @access  Private/Member
const bookClass = async (req, res) => {
    const { classId } = req.body;

    const classItem = await Class.findById(classId);

    if (!classItem) {
        return res.status(404).json({ message: 'Class not found' });
    }

    if (classItem.enrolledCount >= classItem.capacity) {
        return res.status(400).json({ message: 'Class is full' });
    }

    // Check if already booked
    const alreadyBooked = await Booking.findOne({
        member: req.user._id,
        class: classId
    });

    if (alreadyBooked) {
        return res.status(400).json({ message: 'You have already booked this class' });
    }

    const booking = await Booking.create({
        member: req.user._id,
        class: classId
    });

    if (booking) {
        classItem.enrolledCount = classItem.enrolledCount + 1;
        await classItem.save();
        res.status(201).json(booking);
    } else {
        res.status(400).json({ message: 'Invalid booking data' });
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/mybookings
// @access  Private/Member
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ member: req.user._id })
        .populate({
            path: 'class',
            populate: { path: 'trainer', select: 'name' }
        });
    res.json(bookings);
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private/Member
const cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.member.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    // Decrease enrolled count
    const classItem = await Class.findById(booking.class);
    if (classItem) {
        classItem.enrolledCount = Math.max(0, classItem.enrolledCount - 1);
        await classItem.save();
    }

    await booking.deleteOne();
    res.json({ message: 'Booking cancelled' });
};

// @desc    Update booking status (Attendance)
// @route   PUT /api/bookings/:id/status
// @access  Private/Trainer/Admin
const updateBookingStatus = async (req, res) => {
    const { status } = req.body; // 'attended', 'cancelled'
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        // Verify owner/admin access - Simplified for now, assuming authorized via route middleware
        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
};

module.exports = { bookClass, getMyBookings, cancelBooking, updateBookingStatus };
