-- =====================================================
-- CAMPASS OCCUPANCY DETECTION DATABASE SCHEMA
-- =====================================================
-- Run these SQL commands in your Supabase SQL Editor

-- 1. CURRENT OCCUPANCY TABLE
-- Stores real-time occupancy counts for each building
CREATE TABLE IF NOT EXISTS occupancy_current (
  building_id TEXT NOT NULL,
  campus_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (building_id, campus_id)
);

-- 2. OCCUPANCY SESSIONS TABLE
-- Tracks user sessions for entry/exit events
CREATE TABLE IF NOT EXISTS occupancy_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  building_id TEXT NOT NULL,
  campus_id TEXT NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OCCUPANCY HISTORY TABLE
-- Stores historical data for analytics and heatmaps
CREATE TABLE IF NOT EXISTS occupancy_history (
  id SERIAL PRIMARY KEY,
  building_id TEXT NOT NULL,
  campus_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_occupancy_sessions_session_id ON occupancy_sessions(session_id);

-- Index for active sessions (exit_time is null)
CREATE INDEX IF NOT EXISTS idx_occupancy_sessions_active ON occupancy_sessions(building_id, campus_id) WHERE exit_time IS NULL;

-- Index for history queries
CREATE INDEX IF NOT EXISTS idx_occupancy_history_timestamp ON occupancy_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_occupancy_history_building_campus ON occupancy_history(building_id, campus_id);

-- Index for current occupancy
CREATE INDEX IF NOT EXISTS idx_occupancy_current_campus ON occupancy_current(campus_id);

-- =====================================================
-- RLS (ROW LEVEL SECURITY) - OPTIONAL
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE occupancy_current ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancy_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for frontend)
CREATE POLICY "Public read access" ON occupancy_current FOR SELECT USING (true);
CREATE POLICY "Public read access" ON occupancy_sessions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON occupancy_history FOR SELECT USING (true);

-- Allow service role to write data (backend)
CREATE POLICY "Service role write access" ON occupancy_current FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role write access" ON occupancy_sessions FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role write access" ON occupancy_history FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- TRIGGERS FOR AUTOMATIC HISTORY RECORDING
-- =====================================================

-- Function to record history when occupancy changes
CREATE OR REPLACE FUNCTION record_occupancy_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO occupancy_history (building_id, campus_id, count)
  VALUES (NEW.building_id, NEW.campus_id, NEW.count);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically record history
DROP TRIGGER IF EXISTS trigger_record_occupancy_history ON occupancy_current;
CREATE TRIGGER trigger_record_occupancy_history
  AFTER UPDATE ON occupancy_current
  FOR EACH ROW
  EXECUTE FUNCTION record_occupancy_history();

-- =====================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================

-- Insert sample current occupancy
INSERT INTO occupancy_current (building_id, campus_id, count) VALUES
  ('library', 'SJCE', 45),
  ('canteen', 'SJCE', 32),
  ('admin_block', 'SJCE', 18),
  ('lab_block', 'SJCE', 67),
  ('library', 'CIT', 23),
  ('canteen', 'CIT', 28),
  ('admin_block', 'CIT', 12),
  ('library', 'SJIT', 34),
  ('canteen', 'SJIT', 41),
  ('library', 'KPR', 56),
  ('canteen', 'KPR', 38)
ON CONFLICT (building_id, campus_id) DO NOTHING;

-- Insert sample history (last 24 hours)
INSERT INTO occupancy_history (building_id, campus_id, count, timestamp)
SELECT 
  building_id, 
  campus_id, 
  count,
  NOW() - (INTERVAL '1 hour' * floor(random() * 24))
FROM occupancy_current;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for current occupancy with building info
CREATE OR REPLACE VIEW v_current_occupancy AS
SELECT 
  oc.building_id,
  oc.campus_id,
  oc.count,
  oc.last_updated,
  CASE 
    WHEN oc.count < 30 THEN 'QUIET'
    WHEN oc.count < 60 THEN 'MODERATE'
    WHEN oc.count < 85 THEN 'BUSY'
    ELSE 'PACKED'
  END as crowd_level
FROM occupancy_current oc;

-- View for active sessions
CREATE OR REPLACE VIEW v_active_sessions AS
SELECT 
  session_id,
  building_id,
  campus_id,
  entry_time,
  EXTRACT(EPOCH FROM (NOW() - entry_time))/60 as duration_minutes
FROM occupancy_sessions 
WHERE exit_time IS NULL;

-- =====================================================
-- CLEANUP FUNCTIONS
-- =====================================================

-- Function to clean up old history (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_history()
RETURNS void AS $$
BEGIN
  DELETE FROM occupancy_history 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Verify setup
SELECT 'Database schema setup completed!' as status;

-- Show current tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t 
WHERE table_schema = 'public' 
AND table_name LIKE 'occupancy_%'
ORDER BY table_name;
