# Supabase Setup Guide for BangerAgent

This guide walks you through setting up Supabase for the BangerAgent application.

## Prerequisites

- Supabase account (free tier available at supabase.com)
- Already have a Supabase project created

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Project Name: `nichelens`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. Click "Create new project" and wait for initialization (5-10 minutes)

## Step 2: Run Migrations

Once your project is created:

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `001_create_user_profiles.sql` and paste into the editor
5. Click "Run"
6. Repeat steps 3-5 for `002_create_analytics_logs.sql` and `003_create_analysis_history.sql`

Alternatively, use the Supabase CLI:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 3: Get API Keys

1. In Supabase dashboard, go to "Project Settings" (gear icon)
2. Click "API" tab
3. Copy the following credentials:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY) - for frontend
   - `service_role` key (SUPABASE_SERVICE_KEY) - for backend only!

## Step 4: Configure Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=your_claude_api_key
```

### Backend (backend/.env)
```
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_claude_api_key
PORT=5000
```

## Step 5: Configure Authentication (OAuth)

1. In Supabase, go to "Authentication" → "Providers"
2. Enable providers you want (e.g., Twitter/X, Google)
3. Fill in OAuth credentials for each provider:
   - For Twitter: Get from [developer.twitter.com](https://developer.twitter.com)
   - For Google: Get from [console.cloud.google.com](https://console.cloud.google.com)

4. Configure redirect URL:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## Step 6: Verify Tables

1. In Supabase, go to "Table Editor"
2. You should see:
   - `user_profiles`
   - `analytics_logs`
   - `analysis_history`

3. Check that Row Level Security (RLS) is enabled on each table

## Database Schema

### user_profiles
- Stores user account information
- Linked to Supabase auth.users
- Tracks API usage quotas
- Stores user preferences

### analytics_logs
- Logs every API request
- Tracks performance metrics (duration)
- Monitors error rates
- Indexed for efficient queries

### analysis_history
- Stores all analysis results (post optimization, replies, audits, etc.)
- Searchable via input text and handle
- Full-text search capable

## Enabling Full-Text Search

To enable full-text search on analysis history:

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.analysis_history
ADD COLUMN search_vector tsvector;

CREATE INDEX search_vector_idx ON public.analysis_history USING gin(search_vector);

CREATE OR REPLACE FUNCTION analysis_history_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('english', COALESCE(NEW.input, '') || ' ' ||
                           COALESCE(NEW.analysis_type, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analysis_history_search_trigger
  BEFORE INSERT OR UPDATE ON public.analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION analysis_history_search_trigger();
```

## Testing the Setup

1. Run frontend: `npm run dev`
2. Run backend: `cd backend && npm run dev`
3. Try authenticating with your OAuth provider
4. Make an API request and verify:
   - Data appears in `analysis_history`
   - Analytics appear in `analytics_logs`
   - User profile is created in `user_profiles`

## Troubleshooting

### RLS Policies Not Working
- Ensure you're using the `anon` key for frontend requests
- Backend uses `service_role` key which bypasses RLS

### Auth Not Working
- Verify redirect URL is configured in Supabase
- Check OAuth provider credentials are correct
- Look at Supabase Auth logs for errors

### Migrations Fail
- Ensure you have sufficient permissions
- Check that table names don't conflict with existing tables
- Review the error message in SQL Editor

## Monitoring

You can monitor usage via SQL queries in Supabase SQL Editor:

```sql
-- User activity over time
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_requests
FROM analytics_logs
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;

-- Most used features
SELECT
  endpoint,
  COUNT(*) as usage_count,
  AVG(duration_ms) as avg_duration
FROM analytics_logs
GROUP BY endpoint
ORDER BY usage_count DESC;
```

## Next Steps

- Configure backup schedules in Supabase
- Set up email notifications for important events
- Monitor API usage to prevent quota overages
- Implement caching strategies for frequently accessed data
