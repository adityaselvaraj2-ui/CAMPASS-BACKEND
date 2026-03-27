const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// In-memory storage as fallback
let memoryStorage = [];

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

// POST /api/feedback  — save a new feedback entry
router.post('/', async (req, res) => {
  try {
    const { campus, department, year, anonymous, building, mood, comment } = req.body;

    // Enhanced validation
    if (!campus || mood === undefined) {
      return res.status(400).json({ 
        error: 'campus and mood are required',
        details: { campus: !!campus, mood: mood !== undefined }
      });
    }

    if (mood < 0 || mood > 5) {
      return res.status(400).json({ 
        error: 'mood must be between 0 and 5',
        mood: mood 
      });
    }

    const feedbackData = {
      campus: campus.trim(),
      department: department?.trim() || '',
      year: year?.trim() || '',
      anonymous: Boolean(anonymous),
      building: building?.trim() || '',
      mood: Number(mood),
      comment: comment?.trim() || '',
      submittedAt: new Date()
    };

    let savedToMongo = false;
    let errorMessage = '';

    // FIXED: Check MongoDB connection state before attempting save
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ MongoDB not connected (readyState:', mongoose.connection.readyState, ')');
      console.log('💾 Feedback saved to memory (MongoDB unavailable):', feedbackData.campus);
      memoryStorage.push(feedbackData);
      errorMessage = 'MongoDB not connected - using memory fallback';
    } else {
      // Save to MongoDB with fallback
      try {
        console.log('🔍 Attempting to save feedback to MongoDB...');
        console.log('📊 Database name:', mongoose.connection.name);
        console.log('📊 Connection state:', mongoose.connection.readyState);
        
        const entry = new Feedback(feedbackData);
        const savedEntry = await entry.save();
        
        console.log('✅ Feedback saved to MongoDB:', savedEntry._id);
        console.log('✅ Campus:', savedEntry.campus);
        console.log('✅ Database:', mongoose.connection.name);
        savedToMongo = true;
      } catch (mongoErr) {
        console.error('❌ MongoDB save error:', mongoErr.message);
        console.error('❌ Full error:', mongoErr);
        console.log('💾 Feedback saved to memory (MongoDB unavailable):', feedbackData.campus);
        memoryStorage.push(feedbackData);
        console.log(`📊 Total feedback in memory: ${memoryStorage.length}`);
        errorMessage = mongoErr.message;
      }
    }

    // Return success response with detailed status
    res.status(201).json({ 
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        campus: feedbackData.campus,
        mood: feedbackData.mood,
        savedToMongo,
        timestamp: feedbackData.submittedAt,
        storageLocation: savedToMongo ? 'mongodb' : 'memory',
        error: errorMessage || null
      }
    });

  } catch (err) {
    console.error('❌ Feedback submission error:', err);
    res.status(500).json({ 
      error: 'Failed to submit feedback',
      details: err.message 
    });
  }
});

// GET /api/feedback  — retrieve all feedback (for admin)
router.get('/', async (req, res) => {
  try {
    const campus = req.query.campus;
    let feedback = [];
    let source = 'mongodb';

    try {
      const filter = campus ? { campus } : {};
      feedback = await Feedback.find(filter).sort({ submittedAt: -1 }).limit(200);
    } catch (mongoErr) {
      feedback = campus 
        ? memoryStorage.filter(f => f.campus === campus).sort((a, b) => b.submittedAt - a.submittedAt)
        : memoryStorage.sort((a, b) => b.submittedAt - a.submittedAt);
      source = 'memory';
      console.log(`📋 Retrieved ${feedback.length} feedback entries from memory`);
    }
    
    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
      source: source,
      campus: campus || 'all'
    });
  } catch (err) {
    console.error('❌ Error retrieving feedback:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve feedback',
      data: memoryStorage.reverse(),
      source: 'memory'
    });
  }
});

// GET /api/feedback/stats  — get feedback statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$campus',
          total: { $sum: 1 },
          avgMood: { $avg: '$mood' },
          latest: { $max: '$submittedAt' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats,
      totalMemory: memoryStorage.length
    });
  } catch (err) {
    console.error('❌ Error getting stats:', err);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;
