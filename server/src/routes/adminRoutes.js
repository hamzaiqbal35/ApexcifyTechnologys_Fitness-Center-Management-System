const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getDashboard,
    getUsers,
    suspendUser,
    activateUser,
    grantSubscription,
    approveTrainer,
    getPayments,
    refundPayment,
    markPaymentPaid,
    getRevenueReport,
    getAttendanceReport,
} = require('../controllers/adminController');

// All routes require admin role
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// User management
router.get('/users', getUsers);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);
router.post('/users/:id/grant-subscription', grantSubscription);

// Trainer management
router.put('/trainers/:id/approve', approveTrainer);

// Payment management
router.get('/payments', getPayments);
router.post('/payments/:id/refund', refundPayment);
router.post('/payments/:id/mark-paid', markPaymentPaid);

// Reports
router.get('/reports/revenue', getRevenueReport);
router.get('/reports/attendance', getAttendanceReport);

module.exports = router;
