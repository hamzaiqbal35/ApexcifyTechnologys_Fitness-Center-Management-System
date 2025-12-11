const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');
const upload = require('../middleware/uploadMiddleware');

// Public route to submit contact form
// Allow up to 5 files
router.post('/', upload.array('attachments', 5), submitContactForm);

module.exports = router;
