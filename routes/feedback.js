const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// In-memory storage as fallback
let memoryStorage = [];

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Mongoose schema — store exactly what the frontend form collects
const feedbackSchema = new mongoose.Schema({
  campus:     { type: String, required: true },        // e.g. "SJCE"
  department: { type: String, default: '' },           // e.g. "CSE"
  year:       { type: String, default: '' },           // e.g. "2nd Year"
  anonymous:  { type: Boolean, default: false },
  building:   { type: String, default: '' },           // building name
  mood:       { type: Number, required: true },        // 0–5 float
  comment:    { type: String, default: '' },
  submittedAt:{ type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Send email feedback
async function sendEmailFeedback(feedbackData) {
  try {
    console.log('📧 Sending email notification...');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📊 Campus Compass Feedback - ${feedbackData.campus} - ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}`,
      text: `Campus: ${feedbackData.campus}\nDepartment: ${feedbackData.department}\nYear: ${feedbackData.year}\nBuilding: ${feedbackData.building}\nMood: ${feedbackData.mood}/5\nComment: ${feedbackData.comment}\nTime: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🎓Campus Compass Feedback Received</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h3 style="color: #666; margin-top: 0;">Feedback Details:</h3>
            <p><strong>Campus:</strong> ${feedbackData.campus}</p>
            <p><strong>Department:</strong> ${feedbackData.department || 'N/A'}</p>
            <p><strong>Year:</strong> ${feedbackData.year || 'N/A'}</p>
            <p><strong>Building:</strong> ${feedbackData.building || 'N/A'}</p>
            <p><strong>Mood Rating:</strong> ${feedbackData.mood}/5</p>
            <p><strong>Anonymous:</strong> ${feedbackData.anonymous ? 'Yes' : 'No'}</p>
            <p><strong>Comment:</strong> ${feedbackData.comment || 'No comment'}</p>
            <p><strong>Submitted:</strong> ${feedbackData.submittedAt.toLocaleString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This feedback was automatically sent as a notification.
            <br>You can view all feedback in your deployed application dashboard.
          </p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', result.messageId);
    return true;
  } catch (emailErr) {
    console.error('❌ Email failed:', emailErr.message);
    return false;
  }
}

// POST /api/feedback  — save a new feedback entry
router.post('/', async (req, res) => {
  try {
    const { campus, department, year, anonymous, building, mood, comment } = req.body;

    if (!campus || mood === undefined) {
      return res.status(400).json({ error: 'campus and mood are required' });
    }

    const feedbackData = {
      campus, department, year, anonymous, building, mood, comment,
      submittedAt: new Date()
    };

    // Try to save to MongoDB, always send email
    try {
      const entry = new Feedback(feedbackData);
      await entry.save();
      console.log('✅ Feedback saved to MongoDB:', feedbackData);
    } catch (mongoErr) {
      memoryStorage.push(feedbackData);
      console.log('💾 Feedback saved to memory (MongoDB unavailable):', feedbackData);
      console.log(`📊 Total feedback in memory: ${memoryStorage.length}`);
    }
    
    // Always send email notification
    console.log('📧 Sending email notification...');
    const emailSent = await sendEmailFeedback(feedbackData);
    if (emailSent) {
      console.log('✅ Email notification sent successfully');
    } else {
      console.log('❌ Email notification failed, but feedback is saved');
    }

    res.status(201).json({ success: true, message: 'Feedback saved' });
  } catch (err) {
    console.error('Feedback processing error:', err);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

// GET /api/feedback?campus=SJCE  — fetch all feedback for a campus (for admin/analytics)
router.get('/', async (req, res) => {
  try {
    const campus = req.query.campus;
    let feedbacks = [];

    try {
      const filter = campus ? { campus } : {};
      feedbacks = await Feedback.find(filter).sort({ submittedAt: -1 }).limit(200);
    } catch (mongoErr) {
      feedbacks = campus 
        ? memoryStorage.filter(f => f.campus === campus).sort((a, b) => b.submittedAt - a.submittedAt)
        : memoryStorage.sort((a, b) => b.submittedAt - a.submittedAt);
      console.log(`📋 Retrieved ${feedbacks.length} feedback entries from memory`);
    }

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Test email endpoint
router.get('/test-email', async (req, res) => {
  try {
    console.log('📧 Testing email setup...');
    
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Test Email ${Date.now()}`,
      text: 'This is a test email from Campus Compass backend.',
      html: '<h2>Test Email</h2><p>If you receive this, email setup is working!</p>',
    };

    const result = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent! Message ID:', result.messageId);
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: result.messageId 
    });
  } catch (err) {
    console.error('❌ Test email failed:', err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;
