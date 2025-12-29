-- Create life_areas table
CREATE TABLE IF NOT EXISTS life_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_state TEXT,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  top_question TEXT,
  helper TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE life_areas ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read/write their own rows
CREATE POLICY "Users can view their own life areas"
  ON life_areas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own life areas"
  ON life_areas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own life areas"
  ON life_areas
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own life areas"
  ON life_areas
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS life_areas_user_id_idx ON life_areas(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_life_areas_updated_at
  BEFORE UPDATE ON life_areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

