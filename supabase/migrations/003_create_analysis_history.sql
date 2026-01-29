-- Create analysis_history table (enhanced from existing history)
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),

  -- User reference
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,

  -- Analysis details
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('post', 'reply', 'audit', 'niche', 'ideate')),
  input TEXT NOT NULL,
  result JSONB NOT NULL,

  -- Metadata
  handle TEXT,
  model_used TEXT DEFAULT 'claude-3-5-sonnet',
  execution_time_ms INT,

  -- For searching
  search_tokens TEXT,

  CONSTRAINT analysis_history_pkey PRIMARY KEY (id)
);

-- Create indexes for efficient queries
CREATE INDEX idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
CREATE INDEX idx_analysis_history_type ON public.analysis_history(analysis_type);
CREATE INDEX idx_analysis_history_user_type ON public.analysis_history(user_id, analysis_type);
CREATE INDEX idx_analysis_history_created ON public.analysis_history(user_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own history
CREATE POLICY "Users can read their own history" ON public.analysis_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" ON public.analysis_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history" ON public.analysis_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to generate search tokens
CREATE OR REPLACE FUNCTION generate_search_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- Create searchable tokens from input
  NEW.search_tokens :=
    LOWER(NEW.input) || ' ' ||
    LOWER(NEW.analysis_type) || ' ' ||
    COALESCE(LOWER(NEW.handle), '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_search_tokens_trigger
  BEFORE INSERT OR UPDATE ON public.analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION generate_search_tokens();
