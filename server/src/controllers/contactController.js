const Contact = require('../models/Contact');
const { uploadFile } = require('../utils/cloudinaryService');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        let attachments = [];

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // Handle file uploads if any
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await uploadFile(file.buffer, 'fittrack/contact_attachments');
                    attachments.push(result);
                } catch (uploadError) {
                    console.error('Error uploading file:', uploadError);
                }
            }
        }

        const contact = await Contact.create({
            name,
            email,
            message,
            attachments
        });

        // Send Email to Admin
        const adminHtml = `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            ${attachments.length > 0 ? `<p><strong>Attachments:</strong> ${attachments.join(', ')}</p>` : ''}
        `;
        // Send to configured email user or fallback
        await sendEmail(process.env.EMAIL_USER, `New Contact from ${name}`, adminHtml);

        // Send Acknowledgement to User
        const userHtml = `
            <h2>We received your message</h2>
            <p>Hi ${name},</p>
            <p>Thanks for reaching out to FitTrack. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <br>
            <p>- FitTrack Support Team</p>
        `;
        await sendEmail(email, 'We received your message - FitTrack', userHtml);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: contact
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    submitContactForm
};
