-- Create weekly_reflections table
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT,
  week_start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Enable Row Level Security
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read their own reflections
CREATE POLICY "Users can view their own weekly reflections"
  ON weekly_reflections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own reflections
CREATE POLICY "Users can insert their own weekly reflections"
  ON weekly_reflections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own reflections
CREATE POLICY "Users can update their own weekly reflections"
  ON weekly_reflections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own reflections
CREATE POLICY "Users can delete their own weekly reflections"
  ON weekly_reflections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS weekly_reflections_user_id_idx ON weekly_reflections(user_id);
CREATE INDEX IF NOT EXISTS weekly_reflections_week_start_date_idx ON weekly_reflections(week_start_date);
CREATE INDEX IF NOT EXISTS weekly_reflections_user_week_idx ON weekly_reflections(user_id, week_start_date);

