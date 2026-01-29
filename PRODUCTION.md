# Production Deployment Guide

This guide will deploy NicheLens to production in under 15 minutes.

## Architecture

```
Frontend (React)          Backend (Node.js)         Database (Supabase)
    ↓                          ↓                           ↓
  Vercel          →         Railway           ↔      PostgreSQL
  https://...              https://...                      ↓
  (Free tier)              ($5/month)              (Free tier + paid)
```

---

## Prerequisites

You'll need:
1. GitHub account (for deployment)
2. Vercel account (https://vercel.com) - **Free**
3. Railway account (https://railway.app) - **Free tier + $5/month**
4. Supabase account (https://supabase.com) - **Free tier**
5. Anthropic API key (already have this)

---

## Deployment Steps

### **Step 1: Push to GitHub**

```bash
# Create GitHub repository
# Then push your code
git remote add origin https://github.com/YOUR_USERNAME/BangerAgent.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy Backend to Railway**

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your BangerAgent repository
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** Already configured in railway.toml
   - **Port:** 5000
5. Add environment variables:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   NODE_ENV=production
   ```
6. Click **Deploy**
7. Get your backend URL: `https://your-backend.railway.app`

### **Step 3: Deploy Frontend to Vercel**

1. Go to https://vercel.com/new
2. Select your BangerAgent GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Click **Deploy**
6. Get your frontend URL: `https://your-app.vercel.app`

### **Step 4: Update Backend Endpoint in Frontend**

If your backend is on Railway, you need to point the frontend to it.

Create `.env.production` in root:
```
VITE_BACKEND_URL=https://your-backend.railway.app
```

Update `services/apiClient.ts` to use this:
```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function analyzeContent(mode, input, handle) {
  const response = await fetch(`${BACKEND_URL}/api/analysis/${getEndpoint(mode)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, ...(mode !== 'post' && { tweets: input.split('---'), handle }) })
  });
  return response.json();
}
```

### **Step 5: Set Up Supabase for Production** (Optional)

1. Go to https://supabase.com
2. Create a project (same as development if you want)
3. Run migrations (see supabase/SETUP.md)
4. Get credentials from Project Settings → API
5. Add to both Railway and Vercel environment variables

---

## Verification

### Test Backend
```bash
curl https://your-backend.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend
Visit: `https://your-app.vercel.app`
- Click "Sandbox Mode"
- Select "03 Forge"
- Enter text: "I made $10k working 2 hours a week"
- Click "Launch Protocol"
- Should see tweet variations

---

## Monitoring & Logs

### Railway Backend Logs
- Go to your Railway project dashboard
- Click **Deployments** → view logs in real-time

### Vercel Frontend Logs
- Go to your Vercel project dashboard
- Click **Analytics** for performance metrics

---

## Custom Domain Setup

### Frontend Domain (Vercel)
1. In Vercel: Project Settings → Domains
2. Add your domain (e.g., `nichelens.com`)
3. Update DNS records at your registrar
4. Vercel auto-configures SSL

### Backend Domain (Railway)
1. In Railway: Project Settings → Custom Domain
2. Add your domain (e.g., `api.nichelens.com`)
3. Update DNS records
4. SSL certificate auto-issued

---

## Environment Variables Summary

### Backend (Railway)
```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel)
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=https://your-backend.railway.app
```

---

## Cost Breakdown

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Vercel** | ✅ Yes | Frontend hosting |
| **Railway** | ✅ Yes ($5/month after free credits) | Backend hosting |
| **Supabase** | ✅ Yes | Database (limited) |
| **Anthropic API** | ⚠️ Pay-as-you-go | ~$0.001-0.01 per request |
| **Custom Domain** | ~$12/year | Optional, from any registrar |

**Total monthly cost:** $5-15 (depending on usage)

---

## Troubleshooting

### "Backend connection failed"
- Check Railway deployment logs
- Verify ANTHROPIC_API_KEY is set
- Check CORS settings in backend/server.js (already configured)

### "API Key invalid"
- Verify you're using the correct key
- Check for copy/paste errors (no spaces/newlines)
- Generate a new key if needed

### "Supabase not configured"
- This is OK! App works without it
- To enable, add SUPABASE variables

### "Build failed on Vercel"
- Check build logs in Vercel dashboard
- Ensure NODE_ENV variables are set
- Run `npm run build` locally to test

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Railway
3. ✅ Set up custom domains (optional)
4. ✅ Configure monitoring alerts
5. ✅ Set up automated backups (Supabase)
6. ✅ Monitor API costs

---

## Support

- Railway issues: https://railway.app/docs
- Vercel issues: https://vercel.com/docs
- Supabase issues: https://supabase.com/docs
- Anthropic API: https://console.anthropic.com/

**You're now production-ready!** 🚀
