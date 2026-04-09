const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/occupancy/checkin - Simple direct insert like feedback API
router.post('/checkin', async (req, res) => {
  try {
    const { sessionId, buildingId, campus } = req.body;

    console.log(' Occupancy check-in:', { sessionId, buildingId, campus });

    if (!sessionId || !buildingId || !campus) {
      return res.status(400).json({ 
        error: 'sessionId, buildingId, and campus are required'
      });
    }

    let savedToSupabase = false;
    let errorMessage = '';

    // Try to save to Supabase (exactly like feedback API)
    try {
      console.log(' Attempting to save occupancy to Supabase...');
      
      // Insert into occupancy_sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('occupancy_sessions')
        .insert([{
          session_id: sessionId,
          building_id: buildingId,
          campus_id: campus,
          entry_time: new Date().toISOString(),
          exit_time: null
        }])
        .select();
      
      if (sessionError) {
        console.error(' Session insert error:', sessionError.message);
        throw sessionError;
      }
      
      console.log(' Session saved to Supabase');

      // Get current count
      const { data: currentData, error: currentError } = await supabase
        .from('occupancy_current')
        .select('count')
        .eq('building_id', buildingId)
        .eq('campus_id', campus)
        .single();
      
      let newCount = 1;
      if (!currentError && currentData) {
        newCount = (currentData.count || 0) + 1;
      }
      
      console.log(` New count for ${buildingId}: ${newCount}`);

      // Update or insert occupancy_current
      const { data: updateData, error: updateError } = await supabase
        .from('occupancy_current')
        .upsert({
          building_id: buildingId,
          campus_id: campus,
          count: newCount,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'building_id,campus_id'
        })
        .select();
      
      if (updateError) {
        console.error(' Current update error:', updateError.message);
        throw updateError;
      }
      
      console.log(' Occupancy updated in Supabase');
      savedToSupabase = true;
      
    } catch (supabaseErr) {
      console.error(' Supabase error:', supabaseErr.message);
      errorMessage = supabaseErr.message;
    }

    res.status(201).json({ 
      success: true,
      message: 'Occupancy recorded successfully',
      savedToSupabase,
      error: errorMessage || null
    });

  } catch (error) {
    console.error(' Occupancy check-in error:', error);
    res.status(500).json({ 
      error: 'Failed to record occupancy',
      details: error.message 
    });
  }
});

// GET /api/occupancy/current - Get current occupancy for all buildings
router.get('/current', async (req, res) => {
  try {
    const { campus } = req.query;

    if (!campus) {
      return res.status(400).json({ error: 'campus parameter is required' });
    }

    console.log('🔍 Getting current occupancy for campus:', campus);

    // Get current occupancy from database
    const { data: occupancy, error } = await supabase
      .from('occupancy_current')
      .select('*')
      .eq('campus_id', campus);

    if (error) {
      console.error('❌ Database error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch occupancy data' });
    }

    // Format response as simple building_id -> count
    const formattedOccupancy = {};
    occupancy.forEach(record => {
      formattedOccupancy[record.building_id] = record.count;
    });

    console.log('✅ Occupancy data:', formattedOccupancy);

    res.json({
      occupancy: formattedOccupancy,
      campus
    });

  } catch (error) {
    console.error('❌ Current occupancy API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
