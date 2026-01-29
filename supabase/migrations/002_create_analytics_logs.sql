-- Create analytics_logs table
CREATE TABLE IF NOT EXISTS public.analytics_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),

  -- User reference
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,

  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INT NOT NULL,
  duration_ms INT NOT NULL,

  -- Request metadata
  request_size INT,
  response_size INT,
  error_message TEXT,

  -- Timestamp for query efficiency
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for common queries
CREATE INDEX idx_analytics_logs_user_id ON public.analytics_logs(user_id);
CREATE INDEX idx_analytics_logs_timestamp ON public.analytics_logs(timestamp DESC);
CREATE INDEX idx_analytics_logs_endpoint ON public.analytics_logs(endpoint);
CREATE INDEX idx_analytics_logs_user_timestamp ON public.analytics_logs(user_id, timestamp DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own analytics
CREATE POLICY "Users can read their own analytics" ON public.analytics_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a view for analytics summary
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT
  user_id,
  DATE(timestamp) as date,
  COUNT(*) as total_requests,
  AVG(duration_ms) as avg_duration_ms,
  MAX(duration_ms) as max_duration_ms,
  MIN(duration_ms) as min_duration_ms,
  COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
FROM public.analytics_logs
GROUP BY user_id, DATE(timestamp);
