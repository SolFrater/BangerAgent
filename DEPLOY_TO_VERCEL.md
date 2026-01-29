# Vercel Deployment Guide - BangerAgent Frontend

Complete step-by-step guide to deploy BangerAgent frontend to Vercel in 5 minutes.

---

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with your BangerAgent repo
- ✅ Vercel account (free at https://vercel.com)
- ✅ Your Supabase credentials (if using cloud features)
- ✅ Your backend URL (from Railway or similar - optional for local testing)

---

## Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You're ready!

---

## Step 2: Import Project to Vercel

### 2a. Start Import

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for `BangerAgent`
5. Click **"Import"** next to your SolFrater/BangerAgent repo

### 2b. Configure Project

Vercel should auto-detect these settings:
- **Project Name**: `bangeragent` (or customize)
- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `./` (leave blank)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Important**: Make sure root directory is empty (not `/frontend` or other subfolder)

---

## Step 3: Configure Environment Variables

### 3a. Add Environment Variables

In the Vercel import dialog, scroll to **"Environment Variables"** section:

**Add these variables:**

```
VITE_BACKEND_URL
Value: https://your-railway-backend.railway.app
(or http://localhost:5000 for local testing)

VITE_SUPABASE_URL
Value: https://your-project-ref.supabase.co
(optional - get from Supabase dashboard)

VITE_SUPABASE_ANON_KEY
Value: your-supabase-anon-key
(optional - get from Supabase dashboard → Project Settings → API)
```

**How to find these values:**

#### Backend URL (from Railway):
1. Go to Railway Dashboard
2. Select your BangerAgent backend project
3. Click **"Settings"** tab
4. Copy the domain under "Domains"
5. Format: `https://your-app-name.railway.app`

#### Supabase URL:
1. Go to Supabase Dashboard
2. Select your BangerAgent project
3. Go to **Project Settings** → **API**
4. Copy **Project URL**
5. Should look like: `https://abc123def.supabase.co`

#### Supabase Anon Key:
1. Same location as URL above
2. Look for **"anon public"** key under "Your API Keys"
3. Copy the full key (long string starting with `eyJ...`)

---

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for deployment to complete (usually 1-2 minutes)
3. You'll see a success message with your live URL
4. Your BangerAgent is now live! 🎉

**Live URL will be:** `https://bangeragent.vercel.app` (or custom domain)

---

## Step 5: Verify Deployment

### Test 1: App Loads
1. Visit your Vercel URL
2. Should see the BangerAgent interface with orange/gold branding
3. Check browser console (F12) for errors

### Test 2: API Connection
1. Click **"Sandbox Mode"** or **"Authorize X"** button (if configured)
2. Enter some text in the input area
3. Click **"Launch Protocol"**
4. Should get a response from Claude

### Test 3: Check Logs
1. Go to your Vercel project dashboard
2. Click **"Logs"** tab
3. Check for any deployment or runtime errors
4. Should see successful build logs

---

## Common Issues & Solutions

### "Build failed"

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
1. Go to Vercel project settings
2. Find **"Build & Development Settings"**
3. Add environment variable:
   ```
   NODE_OPTIONS
   Value: --legacy-peer-deps
   ```
4. Redeploy

### "Environment variables not loading"

**Solution**:
1. Check you added variables in the import dialog (not Settings page)
2. If already deployed, go to **Settings** → **Environment Variables**
3. Add/update variables there
4. Click **"Redeploy"** button

### "Backend connection refused"

**Possible causes:**
- Backend URL is incorrect
- Backend is offline
- CORS not configured

**Solution:**
1. Test backend manually:
   ```bash
   curl https://your-backend-url/health
   ```
   Should return: `{"status":"ok"}`

2. If it fails:
   - Check backend is deployed
   - Check URL in Vercel environment variables
   - Verify Railway backend is running

### "Supabase connection failed"

**Solution:**
1. Verify Supabase credentials are correct
2. Check variables in Vercel settings
3. Visit Supabase dashboard and confirm project exists
4. Try without Supabase first (should work in sandbox mode)

---

## Advanced: Custom Domain

To use a custom domain (e.g., `bangeragent.com`):

1. Go to your Vercel project → **Settings**
2. Click **"Domains"**
3. Enter your domain: `bangeragent.com`
4. Follow instructions to update DNS records at your domain provider
5. Wait for DNS propagation (usually 5-30 minutes)

---

## Advanced: Environment Variables in Production

To update environment variables after deployment:

1. Go to Vercel project → **Settings**
2. Click **"Environment Variables"**
3. Edit or add variables
4. Vercel will ask to **"Redeploy"**
5. Click **"Redeploy to Production"**
6. Wait for new deployment to complete

---

## Monitoring & Logs

### View Deployment Logs
1. Go to Vercel project → **Deployments**
2. Click the deployment you want to check
3. Click **"Build Logs"** tab
4. Search for errors

### View Runtime Errors
1. Go to Vercel project → **Logs**
2. Can filter by:
   - Error type
   - Time range
   - Source (Edge, Serverless, etc.)

### Performance Analytics
1. Go to Vercel project → **Analytics**
2. View:
   - Core Web Vitals
   - Page load times
   - Requests per minute

---

## Success Checklist

✅ Project imported to Vercel
✅ Environment variables configured
✅ Deployment completed successfully
✅ App loads at Vercel URL
✅ Orange/gold branding visible
✅ "Sandbox Mode" or "Authorize X" button works
✅ API requests get responses
✅ No console errors

---

## Your Vercel URL

After deployment, your app will be live at:

```
https://bangeragent.vercel.app
```

Share this URL with anyone to demo BangerAgent! 🚀

---

## Next Steps

1. ✅ **Frontend deployed to Vercel** (you are here)
2. ⏭️ **Backend deployed to Railway** (if not already done)
3. ⏭️ **Database configured on Supabase** (for cloud features)
4. ⏭️ **X OAuth configured** (for user login)

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **BangerAgent Repo**: Your GitHub repo
- **Vercel Docs**: https://vercel.com/docs

