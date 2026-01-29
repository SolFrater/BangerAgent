# Railway Deployment Guide - BangerAgent Backend

Complete step-by-step guide to deploy BangerAgent backend to Railway in 5 minutes.

---

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with your BangerAgent repo
- ✅ Railway account (free at https://railway.app)
- ✅ Anthropic API key (from https://console.anthropic.com)
- ✅ Supabase credentials (optional, for cloud analytics)

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start Project"** or **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Railway to access your GitHub account
5. You're ready!

---

## Step 2: Create New Project

### 2a. Start Deployment

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Click **"New Project"** button
3. Select **"Deploy from GitHub repo"**
4. Search for and select `SolFrater/BangerAgent`
5. Click **"Deploy Now"**

Railway will auto-detect `backend/railway.toml` and start deployment.

### 2b. Wait for Initial Setup

Railway will:
- Create a new project
- Start building from the backend directory
- This takes 2-3 minutes

You should see:
```
Building...
Deploying...
✓ Service created
```

---

## Step 3: Configure Environment Variables

### 3a. Add Variables

1. In Railway dashboard, go to your **BangerAgent** project
2. Click the **backend service** (or "web" service)
3. Click **"Variables"** tab
4. Add these environment variables:

```
ANTHROPIC_API_KEY
Value: sk-ant-api03-YOUR-KEY-HERE
(Get from https://console.anthropic.com)

SUPABASE_URL
Value: https://your-project-ref.supabase.co
(Get from Supabase → Project Settings → API)

SUPABASE_SERVICE_KEY
Value: your-long-service-key-here
(Get from Supabase → Project Settings → API, look for "service_role")

NODE_ENV
Value: production

PORT
Value: 5000
```

### 3b. How to Find These Values

#### Anthropic API Key:
1. Go to https://console.anthropic.com
2. Click **"API Keys"** (left sidebar)
3. Copy your active API key
4. Should look like: `sk-ant-api03-...`

#### Supabase URL:
1. Go to https://supabase.com/dashboard
2. Select your BangerAgent project
3. Go to **Project Settings** → **API**
4. Copy **Project URL**
5. Should look like: `https://abc123.supabase.co`

#### Supabase Service Key:
1. Same location as URL (Project Settings → API)
2. Look for **"service_role secret"** key
3. Copy the full long string
4. ⚠️ Keep this secret! Only use in backend environment variables

---

## Step 4: Verify Deployment

After adding environment variables, Railway will automatically redeploy.

### Check Status

1. Go to **BangerAgent** project in Railway
2. Click the **backend service**
3. Should see:
   - Status: ✓ **Active** (green)
   - Deployment: **Recent** with timestamps

### View Logs

1. Click the **Logs** tab
2. Should see:
   ```
   🚀 BangerAgent Backend running on port 5000
   📊 API available at http://localhost:5000/api
   [INFO] Supabase connected
   ```

---

## Step 5: Get Your Backend URL

### 5a. Copy Production URL

1. In Railway **BangerAgent** project
2. Click the **backend service**
3. Click **"Settings"** tab
4. Look for **"Domains"** section
5. Copy the URL (should look like):
   ```
   https://bangeragent-api.railway.app
   ```

### 5b. Save This URL

You'll need this for:
- Vercel frontend (as `VITE_BACKEND_URL`)
- X OAuth callback URLs
- Testing

---

## Step 6: Test Backend

### Test 1: Health Check

```bash
curl https://your-railway-url/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Test 2: API Endpoint

```bash
curl -X POST https://your-railway-url/api/analysis/optimize \
  -H "Content-Type: application/json" \
  -d '{"input":"I made $10k working 2 hours a week"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "variations": [...]
  }
}
```

### Test 3: Check Logs for Errors

1. Go to backend service → **Logs**
2. Should see successful requests
3. No `ERROR` or `FAILED` messages

---

## Common Issues & Solutions

### "Build failed"

**Cause**: Missing dependencies

**Solution**:
1. Check `backend/package.json` has all dependencies
2. Manually deploy:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Try deploying again

### "Cannot find module '@anthropic-ai/sdk'"

**Cause**: Dependencies not installed

**Solution**:
1. Go to **Service** → **Settings**
2. Find **"Build Command"** section
3. Make sure it runs `npm install` first
4. Click **"Redeploy"**

### "Supabase not connected"

**Cause**: Invalid credentials

**Solution**:
1. Double-check `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
2. Go to Supabase dashboard and verify they're correct
3. Update in Railway variables
4. Click **"Redeploy"**

### "Port 5000 already in use"

**Cause**: Port conflict (shouldn't happen on Railway)

**Solution**:
1. Check `PORT` environment variable is set to `5000`
2. If not, add it
3. Redeploy

### "Health check failing"

**Cause**: Backend not responding

**Solution**:
1. Check logs for errors
2. Verify `ANTHROPIC_API_KEY` is correct
3. Make sure backend is actually running
4. Try manual curl test

---

## Advanced: Custom Domain

To use a custom domain (e.g., `api.bangeragent.com`):

1. Go to **backend service** → **Settings**
2. Click **"Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `api.bangeragent.com`
5. Copy the CNAME value (shown in Railway)
6. Go to your domain provider (GoDaddy, Namecheap, etc.)
7. Add CNAME record pointing to Railway
8. Wait for DNS propagation (5-30 minutes)

---

## Advanced: View More Logs

### Deployment Logs
1. Go to **Deployments** tab
2. Click a deployment to see build logs
3. Check for warnings or errors

### Runtime Logs
1. Go to **Logs** tab
2. See real-time server output
3. Filter by date/time

### Metrics
1. Go to **Metrics** tab
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response time

---

## Advanced: Redeploy

To redeploy without code changes (e.g., after updating environment variables):

1. Go to **Deployments** tab
2. Click the latest deployment
3. Click **"Redeploy"** button
4. Wait 1-2 minutes

Or trigger automatic redeploy:
1. Push a new commit to GitHub
2. Railway will automatically detect and deploy

---

## Success Checklist

✅ Railway account created
✅ GitHub repo connected
✅ Backend service deployed
✅ Environment variables configured
✅ Health check passing (`/health` returns 200)
✅ API endpoint working (`/api/analysis/optimize` responds)
✅ Logs show no errors
✅ Backend URL copied and saved

---

## Your Backend URL

After successful deployment:

```
https://your-railway-backend.railway.app
```

Example:
```
https://bangeragent-api.railway.app
```

This is what you'll use in Vercel's `VITE_BACKEND_URL` environment variable!

---

## Next Steps

1. ✅ **Backend deployed to Railway** (you are here)
2. ⏭️ **Frontend deployed to Vercel**
3. ⏭️ **Update Vercel with backend URL**
4. ⏭️ **Configure Supabase** (optional)
5. ⏭️ **Set up X OAuth** (optional)

---

## Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Anthropic Console**: https://console.anthropic.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **BangerAgent Repo**: Your GitHub repo
- **Railway Docs**: https://docs.railway.app

