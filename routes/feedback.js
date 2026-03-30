const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// In-memory storage as fallback
let memoryStorage = [];

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

    let savedToSupabase = false;
    let errorMessage = '';

    // Check Supabase connection and save
    try {
      console.log('🔍 Attempting to save feedback to Supabase...');
      
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackData])
        .select();
      
      if (error) {
        console.error('❌ Supabase save error:', error.message);
        throw error;
      }
      
      console.log('✅ Feedback saved to Supabase:', data[0].id);
      console.log('✅ Campus:', data[0].campus);
      savedToSupabase = true;
      
    } catch (supabaseErr) {
      console.error('❌ Supabase save error:', supabaseErr.message);
      console.log('💾 Feedback saved to memory (Supabase unavailable):', feedbackData.campus);
      memoryStorage.push(feedbackData);
      console.log(`📊 Total feedback in memory: ${memoryStorage.length}`);
      errorMessage = supabaseErr.message;
    }

    // Return success response with detailed status
    res.status(201).json({ 
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        campus: feedbackData.campus,
        mood: feedbackData.mood,
        savedToSupabase,
        timestamp: feedbackData.submittedAt,
        storageLocation: savedToSupabase ? 'supabase' : 'memory',
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
    let source = 'supabase';

    try {
      let query = supabase.from('feedback').select('*').order('submitted_at', { ascending: false }).limit(200);
      
      if (campus) {
        query = query.eq('campus', campus);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      feedback = data || [];
    } catch (supabaseErr) {
      console.error('❌ Supabase retrieval error:', supabaseErr.message);
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
    let stats = [];
    
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('campus, mood, submitted_at');
      
      if (error) {
        throw error;
      }
      
      // Group by campus and calculate stats
      const campusGroups = {};
      data.forEach(item => {
        if (!campusGroups[item.campus]) {
          campusGroups[item.campus] = {
            total: 0,
            moodSum: 0,
            latest: item.submitted_at
          };
        }
        campusGroups[item.campus].total++;
        campusGroups[item.campus].moodSum += item.mood;
        if (new Date(item.submitted_at) > new Date(campusGroups[item.campus].latest)) {
          campusGroups[item.campus].latest = item.submitted_at;
        }
      });
      
      stats = Object.keys(campusGroups).map(campus => ({
        _id: campus,
        total: campusGroups[campus].total,
        avgMood: campusGroups[campus].moodSum / campusGroups[campus].total,
        latest: campusGroups[campus].latest
      }));
      
    } catch (supabaseErr) {
      console.error('❌ Supabase stats error:', supabaseErr.message);
      // Return empty stats if Supabase fails
      stats = [];
    }

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
