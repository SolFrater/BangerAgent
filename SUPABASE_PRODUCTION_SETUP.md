# Supabase Production Setup Guide

Complete guide to configure Supabase database for NicheLens production deployment.

---

## Quick Start (5 minutes)

If you want to get started immediately:

1. Create Supabase project: https://supabase.com/dashboard
2. Copy Project URL and keys from Project Settings → API
3. Update environment variables (see Step 3 below)
4. Run migrations (see Step 2 below)
5. Done!

---

## Step 1: Create Supabase Project

### 1a. Sign Up / Log In
- Go to [supabase.com](https://supabase.com)
- Sign in with GitHub or email

### 1b. Create New Project
1. Click **"New Project"** button
2. Enter project details:
   - **Organization**: Select or create new
   - **Project Name**: `nichelens-prod` (or your preferred name)
   - **Database Password**: Generate strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `us-east-1` for US)
3. Click **"Create new project"**
4. Wait 5-10 minutes for project to initialize

### 1c. Verify Project Ready
- You should see the Supabase dashboard
- Left sidebar shows: SQL Editor, Table Editor, Auth, etc.
- If you see "Initializing" message, wait a bit longer

---

## Step 2: Run Database Migrations

You have two options: **Web UI (easiest)** or **CLI (faster if you have multiple projects)**.

### Option A: Using Supabase Web UI (Recommended for First-Time Setup)

**Migration 1: Create User Profiles Table**

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"** button
3. Copy entire contents of `/supabase/migrations/001_create_user_profiles.sql`
4. Paste into the SQL editor
5. Click **"Run"** button (top right)
6. You should see: `Query successful`

**Migration 2: Create Analytics Logs Table**

1. Click **"New query"** again
2. Copy entire contents of `/supabase/migrations/002_create_analytics_logs.sql`
3. Paste and click **"Run"**
4. You should see: `Query successful`

**Migration 3: Create Analysis History Table**

1. Click **"New query"** again
2. Copy entire contents of `/supabase/migrations/003_create_analysis_history.sql`
3. Paste and click **"Run"**
4. You should see: `Query successful`

### Option B: Using Supabase CLI

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Link to your Supabase project
# (You'll need your project ref - find it in Project Settings → General)
supabase link --project-ref your-project-ref-here

# 3. Push all migrations
supabase db push

# 4. Verify migrations ran
supabase db list
```

### Verify Migrations Ran

1. In Supabase, click **"Table Editor"** (left sidebar)
2. You should see three new tables:
   - ✅ `user_profiles`
   - ✅ `analytics_logs`
   - ✅ `analysis_history`

If you don't see them, check the SQL Editor for error messages.

---

## Step 3: Get API Keys & Configure Environment Variables

### 3a. Copy API Keys from Supabase

1. In Supabase dashboard, go to **"Project Settings"** (gear icon, top right)
2. Click **"API"** tab
3. You'll see several keys. Copy these:

| Key | Use | Copy To |
|-----|-----|---------|
| **Project URL** | API endpoint | `SUPABASE_URL` in backend |
| **anon public** | Frontend requests | `VITE_SUPABASE_ANON_KEY` in frontend |
| **service_role** | Backend requests | `SUPABASE_SERVICE_KEY` in backend |

**⚠️ SECURITY**: Never expose `service_role` key on frontend. Only use on backend.

### 3b. Update Backend Environment Variables

Update `backend/.env`:

```bash
# Backend Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-...
PORT=5000
NODE_ENV=production
```

### 3c. Update Frontend Environment Variables

Update `.env.local`:

```bash
# Frontend Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_BACKEND_URL=http://localhost:5000  # Change for production
```

### 3d. Update Production Deployment Platforms

**For Vercel (Frontend):**

1. Go to Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_BACKEND_URL=https://your-railway-backend.railway.app
   ```

**For Railway (Backend):**

1. Go to Railway project settings
2. Navigate to **Variables**
3. Add:
   ```
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

---

## Step 4: Verify Setup

### Test 1: Database Connection (Backend)

```bash
# Start backend locally
cd backend
npm run dev

# Should see: "✅ Supabase connected" in logs
```

### Test 2: API Request Flow

```bash
# Make a request through the API
curl -X POST http://localhost:5000/api/analysis/optimize \
  -H "Content-Type: application/json" \
  -d '{"input":"I made $10k working 2 hours a week"}'

# Response should include the optimization
```

### Test 3: Check Database for Records

1. In Supabase, click **"Table Editor"**
2. Click **`analysis_history`** table
3. You should see a new row with your request
4. You should see timestamps and JSON results

### Test 4: Frontend Integration

```bash
# Start frontend
npm run dev

# Navigate to http://localhost:3000
# Try the "Optimize Tweet" feature
# If Supabase is working, the result should appear in history
```

---

## Step 5: Configure Row-Level Security (RLS)

RLS is already enabled by the migration scripts, but verify it's working:

### Check RLS Status

1. In Supabase, go to **Table Editor**
2. Click each table:
   - `user_profiles`
   - `analytics_logs`
   - `analysis_history`
3. Click **"Auth Policies"** tab
4. You should see multiple policies for each table

### How RLS Works

- **Frontend** uses `anon` key → Can only see their own data (RLS enforces this)
- **Backend** uses `service_role` key → Can see all data (bypasses RLS)

This keeps user data isolated while allowing the backend to function normally.

---

## Step 6: Optional - Set Up Authentication

If you want user login (Twitter/X, Google, etc.):

1. In Supabase, go to **Authentication** → **Providers**
2. Enable desired providers:
   - **Twitter/X**: Get API credentials from developer.twitter.com
   - **Google**: Get from console.cloud.google.com
   - **GitHub**: Get from github.com/settings/developers
3. Fill in API credentials
4. Set redirect URLs:
   - Dev: `http://localhost:3000/auth/callback`
   - Prod: `https://yourdomain.com/auth/callback`

---

## Step 7: Monitor & Maintain

### View Request Analytics

In Supabase SQL Editor, run:

```sql
-- See request volume over time
SELECT
  DATE(timestamp) as date,
  COUNT(*) as total_requests,
  AVG(duration_ms) as avg_duration_ms,
  COUNT(CASE WHEN status_code >= 400 THEN 1 END) as errors
FROM analytics_logs
GROUP BY DATE(timestamp)
ORDER BY date DESC
LIMIT 30;
```

### Check Storage Usage

1. In Supabase, go to **Project Settings** → **Usage**
2. View:
   - Database size
   - API requests
   - Edge function invocations

### Set Up Backups

1. In Supabase, go to **Project Settings** → **Backups**
2. Enable daily backups (automatically enabled on paid plans)
3. Manual backups available anytime

---

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'url')"

**Cause**: Supabase environment variables not loaded

**Fix**:
```bash
# Backend
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-key-here"
npm run dev

# Verify with
echo $SUPABASE_URL
```

### Error: "Row-level security violation"

**Cause**: Using wrong API key or permission issue

**Fix**:
- Frontend should use `anon` key
- Backend should use `service_role` key
- Verify keys in `.env` files match Supabase project

### Error: "Relation 'public.user_profiles' does not exist"

**Cause**: Migrations haven't run yet

**Fix**:
- Go to Supabase SQL Editor
- Run all three migration files (001, 002, 003)
- Verify each shows "Query successful"

### Migrations Ran But Tables Don't Show

**Cause**: SQL Editor cache issue

**Fix**:
1. Refresh page: `Ctrl+R` or `Cmd+R`
2. Or click **"Refresh"** button in Table Editor
3. Wait 10 seconds for UI to update

### Cannot Connect from Production

**Cause**: IP allowlist or firewall

**Fix**:
1. Check Railway/Vercel logs for connection errors
2. Verify environment variables are set correctly
3. Supabase doesn't have IP allowlist (all IPs allowed by default)
4. Check database password is correct

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Production Deployment                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │  Vercel (Frontend)          │  Railway (Backend)     │
│  │  - React App      │         │  - Express API   │     │
│  │  - VITE_BACKEND_URL─────────→  - Node.js      │     │
│  │  - anon key       │         │  - service_role key
│  └──────────────────┘         └────────┬─────────┘     │
│                                        │                │
│                          ┌─────────────▼──────────┐    │
│                          │  Supabase (Database)   │    │
│                          │  - user_profiles       │    │
│                          │  - analytics_logs      │    │
│                          │  - analysis_history    │    │
│                          │  - Row-Level Security  │    │
│                          └────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Run migrations
3. ✅ Configure environment variables
4. ✅ Deploy frontend to Vercel
5. ✅ Deploy backend to Railway
6. ✅ Test end-to-end
7. ⏭️ (Optional) Set up monitoring alerts
8. ⏭️ (Optional) Configure custom domain

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Anthropic API**: https://docs.anthropic.com
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
