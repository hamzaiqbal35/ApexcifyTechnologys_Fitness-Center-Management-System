const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    checkInWithQR,
    manualCheckIn,
    getClassAttendance,
    getMemberAttendance,
} = require('../controllers/attendanceController');

// QR check-in (member)
router.post('/checkin', protect, checkInWithQR);

// Manual check-in (trainer)
router.post('/manual', protect, authorize('trainer', 'admin'), manualCheckIn);

// Get class attendance (trainer/admin)
router.get('/class/:classId', protect, authorize('trainer', 'admin'), getClassAttendance);

// Get member attendance history (member/admin)
router.get('/member/:memberId', protect, getMemberAttendance);

module.exports = router;
