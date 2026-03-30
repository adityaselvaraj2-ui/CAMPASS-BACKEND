-- Create feedback table for campus compass application
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campus TEXT NOT NULL,
  department TEXT DEFAULT '',
  year TEXT DEFAULT '',
  anonymous BOOLEAN DEFAULT FALSE,
  building TEXT DEFAULT '',
  mood DECIMAL(3,2) NOT NULL CHECK (mood >= 0 AND mood <= 5),
  comment TEXT DEFAULT '',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_campus ON feedback(campus);
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_campus_mood ON feedback(campus, mood);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy for allowing all operations (for development)
-- In production, you might want more restrictive policies
CREATE POLICY "Enable all operations for feedback" ON feedback
  FOR ALL USING (true)
  WITH CHECK (true);

-- Optional: Create a view for statistics
CREATE OR REPLACE VIEW feedback_stats AS
SELECT 
  campus,
  COUNT(*) as total,
  AVG(mood) as avg_mood,
  MAX(submitted_at) as latest_submission
FROM feedback
GROUP BY campus
ORDER BY total DESC;
