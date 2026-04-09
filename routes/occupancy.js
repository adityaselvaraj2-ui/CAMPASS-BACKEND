const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Session management - track active sessions
const activeSessions = new Map();

// Helper function to generate session expiry time
function getSessionExpiry() {
  return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
}

// Helper function to cleanup expired sessions
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.lastActivity < now - 30 * 60 * 1000) { // 30 minutes inactive
      activeSessions.delete(sessionId);
      console.log(`Cleaned up expired session: ${sessionId}`);
    }
  }
}

// Helper function to handle building entry/exit
async function handleOccupancyUpdate(sessionId, buildingId, action, campus) {
  try {
    const session = activeSessions.get(sessionId);
    if (!session) {
      return { error: 'Session not found' };
    }

    // Update last activity
    session.lastActivity = Date.now();

    // If user is entering a building
    if (action === 'enter') {
      // First, exit from previous building if any
      if (session.currentBuilding && session.currentBuilding !== buildingId) {
        await exitBuilding(session.currentBuilding, sessionId, campus);
      }

      // Set current building
      session.currentBuilding = buildingId;

      // Update occupancy count
      await enterBuilding(buildingId, sessionId, campus);

      return { 
        success: true, 
        action: 'entered',
        buildingId,
        previousBuilding: session.currentBuilding === buildingId ? null : session.currentBuilding
      };
    }

    // If user is exiting a building
    if (action === 'exit') {
      const previousBuilding = session.currentBuilding;
      session.currentBuilding = null;

      if (previousBuilding) {
        await exitBuilding(previousBuilding, sessionId, campus);
      }

      return { 
        success: true, 
        action: 'exited',
        buildingId: previousBuilding
      };
    }

    return { error: 'Invalid action' };

  } catch (error) {
    console.error('Occupancy update error:', error);
    return { error: 'Failed to update occupancy' };
  }
}

// Helper function to enter building
async function enterBuilding(buildingId, sessionId, campus) {
  const now = new Date().toISOString();
  
  // Insert session record
  await supabase
    .from('occupancy_sessions')
    .insert({
      session_id: sessionId,
      building_id: buildingId,
      campus_id: campus,
      entry_time: now,
      exit_time: null
    });

  // Update current occupancy
  const { data: current } = await supabase
    .from('occupancy_current')
    .select('count')
    .eq('building_id', buildingId)
    .eq('campus_id', campus)
    .single();

  if (current) {
    await supabase
      .from('occupancy_current')
      .update({ 
        count: current.count + 1,
        last_updated: now
      })
      .eq('building_id', buildingId)
      .eq('campus_id', campus);
  } else {
    await supabase
      .from('occupancy_current')
      .insert({
        building_id: buildingId,
        campus_id: campus,
        count: 1,
        last_updated: now
      });
  }

  console.log(`Session ${sessionId} entered building ${buildingId} in ${campus}`);
}

// Helper function to exit building
async function exitBuilding(buildingId, sessionId, campus) {
  const now = new Date().toISOString();
  
  // Update session record with exit time
  await supabase
    .from('occupancy_sessions')
    .update({ exit_time: now })
    .eq('session_id', sessionId)
    .eq('building_id', buildingId)
    .is('exit_time', null);

  // Update current occupancy
  const { data: current } = await supabase
    .from('occupancy_current')
    .select('count')
    .eq('building_id', buildingId)
    .eq('campus_id', campus)
    .single();

  if (current && current.count > 0) {
    await supabase
      .from('occupancy_current')
      .update({ 
        count: current.count - 1,
        last_updated: now
      })
      .eq('building_id', buildingId)
      .eq('campus_id', campus);
  }

  console.log(`Session ${sessionId} exited building ${buildingId} in ${campus}`);
}

// POST /api/occupancy/checkin - Handle building entry/exit
router.post('/checkin', async (req, res) => {
  try {
    const { sessionId, buildingId, action, campus } = req.body;

    if (!sessionId || !action || !campus) {
      return res.status(400).json({ error: 'sessionId, action, and campus are required' });
    }

    if (!['enter', 'exit'].includes(action)) {
      return res.status(400).json({ error: 'action must be enter or exit' });
    }

    // Cleanup expired sessions
    cleanupExpiredSessions();

    // Get or create session
    let session = activeSessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        currentBuilding: null,
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      activeSessions.set(sessionId, session);
    }

    // Handle occupancy update
    const result = await handleOccupancyUpdate(sessionId, buildingId, action, campus);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Checkin API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/occupancy/batch - Handle batch updates (for building changes)
router.post('/batch', async (req, res) => {
  try {
    const { sessionId, fromBuilding, toBuilding, campus } = req.body;

    if (!sessionId || !campus) {
      return res.status(400).json({ error: 'sessionId and campus are required' });
    }

    // Cleanup expired sessions
    cleanupExpiredSessions();

    // Get or create session
    let session = activeSessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        currentBuilding: null,
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      activeSessions.set(sessionId, session);
    }

    const results = [];

    // Exit previous building
    if (fromBuilding && fromBuilding !== toBuilding) {
      const exitResult = await handleOccupancyUpdate(sessionId, fromBuilding, 'exit', campus);
      results.push(exitResult);
    }

    // Enter new building
    if (toBuilding) {
      const enterResult = await handleOccupancyUpdate(sessionId, toBuilding, 'enter', campus);
      results.push(enterResult);
    }

    res.json({ success: true, results });

  } catch (error) {
    console.error('Batch API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/occupancy/current - Get current occupancy for all buildings
router.get('/current', async (req, res) => {
  try {
    const { campus } = req.query;

    if (!campus) {
      return res.status(400).json({ error: 'campus parameter is required' });
    }

    // Get current occupancy from database
    const { data: occupancy, error } = await supabase
      .from('occupancy_current')
      .select('*')
      .eq('campus_id', campus);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch occupancy data' });
    }

    // Format response
    const formattedOccupancy = {};
    occupancy.forEach(record => {
      formattedOccupancy[record.building_id] = {
        count: record.count,
        lastUpdated: record.last_updated
      };
    });

    res.json({
      campus,
      occupancy: formattedOccupancy,
      timestamp: new Date().toISOString(),
      activeSessions: activeSessions.size
    });

  } catch (error) {
    console.error('Current occupancy API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/occupancy/history - Get historical occupancy data
router.get('/history', async (req, res) => {
  try {
    const { campus, buildingId, hours = 24 } = req.query;

    if (!campus) {
      return res.status(400).json({ error: 'campus parameter is required' });
    }

    // Calculate time range
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - parseInt(hours) * 60 * 60 * 1000);

    let query = supabase
      .from('occupancy_history')
      .select('*')
      .eq('campus_id', campus)
      .gte('timestamp', startTime.toISOString())
      .lte('timestamp', endTime.toISOString())
      .order('timestamp', { ascending: true });

    if (buildingId) {
      query = query.eq('building_id', buildingId);
    }

    const { data: history, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch history data' });
    }

    res.json({
      campus,
      buildingId: buildingId || 'all',
      hours: parseInt(hours),
      history: history || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('History API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/occupancy/stats - Get occupancy statistics
router.get('/stats', async (req, res) => {
  try {
    const { campus } = req.query;

    if (!campus) {
      return res.status(400).json({ error: 'campus parameter is required' });
    }

    // Get current occupancy
    const { data: current } = await supabase
      .from('occupancy_current')
      .select('*')
      .eq('campus_id', campus);

    // Get today's history for peak times
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todayHistory } = await supabase
      .from('occupancy_history')
      .select('*')
      .eq('campus_id', campus)
      .gte('timestamp', today.toISOString())
      .order('count', { ascending: false })
      .limit(10);

    // Calculate statistics
    const totalOccupancy = current?.reduce((sum, record) => sum + record.count, 0) || 0;
    const peakCount = todayHistory?.[0]?.count || 0;
    const peakBuilding = todayHistory?.[0]?.building_id || null;

    res.json({
      campus,
      totalOccupancy,
      activeSessions: activeSessions.size,
      peakCount,
      peakBuilding,
      buildingCount: current?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/occupancy/session - End a session
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Exit current building if any
    if (session.currentBuilding) {
      const { campus } = req.body;
      if (campus) {
        await exitBuilding(session.currentBuilding, sessionId, campus);
      }
    }

    // Remove session
    activeSessions.delete(sessionId);

    res.json({ success: true, message: 'Session ended' });

  } catch (error) {
    console.error('Session delete API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cleanup expired sessions every 5 minutes
setInterval(cleanupExpiredSessions, 5 * 60 * 1000);

module.exports = router;
