# BangerAgent Quick Start Guide

This guide walks you through setting up and running BangerAgent locally, then deploying it.

---

## Step 2️⃣: Create `.env.local` ✅

**Already done!** Created in root directory with placeholders.

### Your next action:
1. Get your Anthropic API key from https://console.anthropic.com/
2. Edit `.env.local` and replace:
   ```
   ANTHROPIC_API_KEY=sk-ant-v0-YOUR_KEY_HERE
   ```
3. Save the file

---

## Step 3️⃣: Run Locally

### Option A: Docker Compose (Recommended)

```bash
# 1. Make sure you have Docker installed
docker --version
docker-compose --version

# 2. Copy your API key to .env.local
# Edit: ANTHROPIC_API_KEY=your_key

# 3. Start the entire app (frontend + backend)
docker-compose up --build

# 4. Open in browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/health
```

**To stop:**
```bash
docker-compose down
```

### Option B: Manual (Without Docker)

**Terminal 1 - Frontend:**
```bash
# In root directory
npm install
npm run dev

# App available at http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
# In backend directory
cd backend
npm install
npm run dev

# API available at http://localhost:5000
```

### Testing the App

1. Go to http://localhost:3000
2. Click **"Sandbox Mode"** to login
3. Click **"03 Forge"** mode
4. Paste some text: `"I made $10k working 2 hours a week"`
5. Click **"Launch Protocol"**
6. Should see optimized tweet variations appear

### Verify Backend is Working

```bash
# In another terminal, test the API
curl http://localhost:5000/health

# Response should be:
# {"status":"ok","timestamp":"2026-01-29T..."}
```

---

## Step 4️⃣: Set Up Supabase (Optional)

Supabase adds cloud storage, user authentication, and analytics. The app works without it, but here's how to enable it.

### 4.1 Create Supabase Project

1. Go to https://supabase.com and click **"Start your project"**
2. Sign up / Sign in with GitHub
3. Create organization (or use existing)
4. Create new project:
   - **Name**: `nichelens`
   - **Database Password**: Generate a strong one (save it!)
   - **Region**: Pick closest to your location
   - Click **"Create new project"**
5. Wait 5-10 minutes for initialization ⏳

### 4.2 Get Your Credentials

1. In Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Copy these three values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY` (frontend)
   - **service_role** secret → `SUPABASE_SERVICE_KEY` (backend only!)

### 4.3 Update Environment Files

**In `.env.local` (Frontend):**
```bash
ANTHROPIC_API_KEY=sk-ant-v0-xxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**In `backend/.env` (Backend):**
```bash
ANTHROPIC_API_KEY=sk-ant-v0-xxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
```

### 4.4 Run Database Migrations

You need to create the tables in Supabase.

#### Option A: Supabase Dashboard (Easiest)

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/migrations/001_create_user_profiles.sql`
4. Copy the entire content
5. Paste into Supabase SQL Editor
6. Click **"RUN"**
7. Repeat for `002_create_analytics_logs.sql` and `003_create_analysis_history.sql`

#### Option B: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 4.5 Test Supabase Connection

1. Restart your frontend/backend
2. You should see "Cloud Sync Online" in footer (instead of "Local Sandbox Mode")
3. Try logging in with OAuth (Twitter/Google)
4. Make a request and check Supabase dashboard → Table Editor to verify data is stored

---

## Step 5️⃣: Deploy to Production

Choose one of these options based on your preference:

### Option A: Vercel (Simplest for Frontend)

Best for: Quick, easy frontend deployment

```bash
# 1. Push your code to GitHub
git push origin claude/complete-supabase-claude-app-1mfi9

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Configure environment variables:
ANTHROPIC_API_KEY=your-key
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key

# 6. Deploy! (automatic on every push)
```

**After deployment:**
- Frontend available at: `your-project.vercel.app`
- Backend still needs deployment (see below)

### Option B: Railway (Full Stack - Recommended)

Best for: Complete app with backend + database in one platform

```bash
# 1. Go to https://railway.app
# 2. Click "New Project" → "Deploy from GitHub"
# 3. Select your repository
# 4. Add services:

# Frontend Service:
# - Source: GitHub
# - Build: npm run build
# - Start: npm run preview
# - Port: 3000
# - Environment: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY

# Backend Service:
# - Source: GitHub (same repo)
# - Root directory: backend
# - Build: npm install
# - Start: node server.js
# - Port: 5000
# - Environment: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY

# 5. Deploy!
```

**Cost:** Free tier available, ~$5/month for production

### Option C: Docker + Self-Hosted VPS

Best for: Maximum control and cost savings

```bash
# 1. Rent a VPS (DigitalOcean, Linode, AWS, etc.)
# 2. SSH into your server
ssh root@your-vps-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. Clone your repository
git clone https://github.com/yourusername/BangerAgent.git
cd BangerAgent

# 5. Create .env file
nano .env
# Add your API keys

# 6. Start with Docker Compose
docker-compose up -d

# 7. Setup Nginx for reverse proxy (optional)
# Access via your domain name

# 8. Get SSL certificate (Let's Encrypt)
certbot certonly --standalone -d yourdomain.com
```

**Cost:** $5-20/month for VPS

### Option D: Render

Best for: Simple, free tier available

```bash
# 1. Go to https://render.com
# 2. New → Web Service
# 3. Connect GitHub repository
# 4. Configure:
#    - Build Command: docker build -f Dockerfile.frontend .
#    - Start Command: http-server dist -p 3000
#    - Environment: Add your API keys
# 5. Deploy!

# 6. Create second service for backend
#    - Same process, point to backend/Dockerfile
```

**Cost:** Free tier + $7/month for auto-deploy

---

## Deployment Comparison

| Platform | Cost | Setup Time | Best For |
|----------|------|-----------|----------|
| **Vercel** | Free+ | 5 min | Frontend only, easiest |
| **Railway** | $5+/mo | 15 min | Full stack, recommended |
| **Render** | Free+ | 15 min | Full stack, free tier |
| **Self-Hosted** | $5-20/mo | 30 min | Full control, cheapest |
| **Docker Compose** | Free | 2 min | Local development |

---

## Verify Everything Works

### Local Testing

```bash
# 1. Frontend loads
curl http://localhost:3000

# 2. Backend responds
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}

# 3. Can make API request
curl -X POST http://localhost:5000/api/analysis/optimize \
  -H "Content-Type: application/json" \
  -d '{"input":"I made $10k in 2 hours"}'
```

### Post-Deployment Testing

```bash
# Test your deployed frontend
curl https://your-app.vercel.app

# Test your backend (if deployed)
curl https://your-api.railway.app/health
```

---

## Troubleshooting

### "ANTHROPIC_API_KEY is missing"
- Make sure `.env.local` exists in root directory
- Restart dev server after adding key
- For Docker: rebuild with `docker-compose up --build`

### "Cannot connect to backend"
- Is backend running? Check http://localhost:5000/health
- If deployed, update frontend API endpoint in `App.tsx`
- Check CORS is configured in backend

### "Supabase not connecting"
- Verify credentials in `.env.local` are correct
- Check Supabase dashboard for project status
- Run migrations in SQL Editor

### "Blank page on localhost:3000"
- Check browser console (F12) for errors
- Run `npm run build` to check build errors
- Clear cache and reload

### Docker won't start
- Check if ports 3000, 5000 are free
- Run: `docker system prune -a`
- Try rebuild: `docker-compose up --build --no-cache`

---

## Next Steps After Deployment

1. ✅ Get API keys
2. ✅ Run locally
3. ✅ Set up Supabase (optional)
4. ✅ Deploy to production
5. **Now:**
   - Set up GitHub Actions CI/CD (automatic testing on push)
   - Enable domain with SSL certificate
   - Configure backup strategy
   - Monitor uptime and errors
   - Track analytics

---

## Support

- 📚 Full docs: See `README.md`, `DEPLOYMENT.md`, `supabase/SETUP.md`
- 🐛 Issues: Check GitHub Issues
- 💬 Questions: See troubleshooting section above

**Good luck! 🚀**
