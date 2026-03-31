const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Enquiry: ${subject || 'Contact Form Submission'}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #0d1b3e; color: #faf6ee; padding: 32px; border-radius: 12px;">
          <h2 style="color: #c9a84c; border-bottom: 1px solid #c9a84c; padding-bottom: 12px;">New Portfolio Enquiry</h2>
          <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px 0; color: #c9a84c; width: 120px;"><strong>Name</strong></td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #c9a84c;"><strong>Email</strong></td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #c9a84c;"><strong>Phone</strong></td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #c9a84c;"><strong>Subject</strong></td><td style="padding: 8px 0;">${subject || 'General Enquiry'}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #1a2744; border-left: 3px solid #c9a84c; border-radius: 4px;">
            <p style="color: #c9a84c; margin-bottom: 8px;"><strong>Message</strong></p>
            <p style="line-height: 1.7;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #888;">Sent via Audit Portfolio Contact Form</p>
        </div>
      `,
    };

    // Auto-reply to sender
    const autoReply = {
      from: `"Audit Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for your enquiry',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #0d1b3e; color: #faf6ee; padding: 32px; border-radius: 12px;">
          <h2 style="color: #c9a84c;">Thank You, ${name}!</h2>
          <p style="line-height: 1.8; margin-top: 16px;">We have received your enquiry and will get back to you within 24–48 business hours.</p>
          <p style="line-height: 1.8;">Our team specializes in Statutory Audits, Government Liaison, and internationally recognized audit certifications including SMETA, BSCI, WCA, GSV, SCAN, CT-PAT, and more.</p>
          <p style="margin-top: 24px; color: #c9a84c; font-style: italic;">— Audit & Compliance Professionals</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReply);

    res.json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
