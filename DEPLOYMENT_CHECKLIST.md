# NicheLens Production Deployment Checklist

Complete checklist to verify everything is ready for production deployment.

---

## ✅ Pre-Deployment Setup

### Backend Configuration
- [ ] `backend/.env` has `ANTHROPIC_API_KEY`
- [ ] `backend/.env` has `PORT=5000`
- [ ] `backend/.env` has `NODE_ENV=production`
- [ ] `backend/.env` has `SUPABASE_URL` (if using database)
- [ ] `backend/.env` has `SUPABASE_SERVICE_KEY` (if using database)
- [ ] `backend/railway.toml` exists with deployment config
- [ ] Backend dependencies installed: `cd backend && npm install`

### Frontend Configuration
- [ ] `.env.local` has `VITE_BACKEND_URL=http://localhost:5000`
- [ ] `.env.local` has `VITE_SUPABASE_URL` (if using database)
- [ ] `.env.local` has `VITE_SUPABASE_ANON_KEY` (if using database)
- [ ] Frontend dependencies installed: `npm install`
- [ ] Build works: `npm run build` succeeds without errors

### Database Setup
- [ ] Supabase project created
- [ ] Migration 001: `001_create_user_profiles.sql` ✅
- [ ] Migration 002: `002_create_analytics_logs.sql` ✅
- [ ] Migration 003: `003_create_analysis_history.sql` ✅
- [ ] All three tables visible in Supabase Table Editor
- [ ] Row-Level Security (RLS) enabled on all tables

---

## ✅ Local Testing

### Test 1: Backend Server
```bash
cd backend
npm run dev
# Should output: 🚀 NicheLens Backend running on port 5000
```
- [ ] Backend starts without errors
- [ ] Health check works: `curl http://localhost:5000/health`
- [ ] Returns: `{"status":"ok","timestamp":"..."}`

### Test 2: Frontend Development
```bash
npm run dev
# Should output: VITE v... ready in ... ms
```
- [ ] Frontend starts without errors
- [ ] App loads at `http://localhost:3000`
- [ ] UI displays correctly

### Test 3: API Integration
```bash
curl -X POST http://localhost:5000/api/analysis/optimize \
  -H "Content-Type: application/json" \
  -d '{"input":"I made $10k working 2 hours a week"}'
```
- [ ] API endpoint responds
- [ ] Returns JSON with variations
- [ ] No authentication errors

### Test 4: Database Logging (if Supabase enabled)
1. Make a few API requests through frontend
2. Check Supabase Table Editor → `analysis_history`
   - [ ] Rows appear with your requests
   - [ ] All columns populated correctly
   - [ ] Timestamps are recent

### Test 5: Production Build
```bash
npm run build
# Should create dist/ folder without errors
```
- [ ] Build completes successfully
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists

---

## ✅ Deployment Preparation

### Code Cleanup
- [ ] No console.log debug statements in production code
- [ ] No `.env.local` file in git (should be in .gitignore)
- [ ] No API keys hardcoded anywhere
- [ ] All commits pushed to `claude/complete-supabase-claude-app-1mfi9` branch

### Environment Variables Documentation
- [ ] `.env.example` (frontend template) updated
- [ ] `backend/.env.example` (backend template) updated
- [ ] All required variables documented
- [ ] All optional variables documented

### Deployment Configuration Files
- [ ] `vercel.json` exists and configured
- [ ] `backend/railway.toml` exists and configured
- [ ] `SUPABASE_PRODUCTION_SETUP.md` exists with instructions
- [ ] `PRODUCTION.md` exists with architecture details

---

## 🚀 Deploy to Production

### Step 1: Deploy Backend to Railway

1. [ ] Create Railway account: https://railway.app
2. [ ] Connect GitHub repository
3. [ ] Create new project from this repo
4. [ ] Configure environment variables:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGc...
   NODE_ENV=production
   PORT=5000
   ```
5. [ ] Deploy (Railway auto-detects `backend/railway.toml`)
6. [ ] Note the deployed URL: `https://your-app.railway.app`
7. [ ] Test health endpoint: `curl https://your-app.railway.app/health`
   - [ ] Returns `{"status":"ok",...}`
8. [ ] Test API endpoint:
   ```bash
   curl -X POST https://your-app.railway.app/api/analysis/optimize \
     -H "Content-Type: application/json" \
     -d '{"input":"test tweet"}'
   ```
   - [ ] Returns valid response

### Step 2: Deploy Frontend to Vercel

1. [ ] Create Vercel account: https://vercel.com
2. [ ] Import GitHub repository
3. [ ] Configure build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. [ ] Set environment variables:
   ```
   VITE_BACKEND_URL=https://your-app.railway.app
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
5. [ ] Deploy
6. [ ] Note the deployed URL: `https://nichelens.vercel.app`
7. [ ] Open app and verify it loads
8. [ ] Check browser console for errors (F12)

### Step 3: Verify Production Integration

1. [ ] Frontend loads at your Vercel URL
2. [ ] Try "Optimize Tweet" feature
   - [ ] Enters text
   - [ ] Clicks analyze
   - [ ] Receives response from backend
   - [ ] No CORS errors
3. [ ] Check Supabase Table Editor → `analysis_history`
   - [ ] New rows appear from production requests
4. [ ] Check backend logs in Railway
   - [ ] Should see request logs
   - [ ] No error messages

---

## 📊 Post-Deployment Monitoring

### Database
- [ ] Enable automated backups in Supabase
- [ ] Check storage usage in Supabase Settings → Usage
- [ ] Verify analytics are being logged

### Backend
- [ ] Monitor Railway deployment dashboard
- [ ] Check application logs for errors
- [ ] Verify rate limiting is working (test with rapid requests)

### Frontend
- [ ] Monitor Vercel deployment dashboard
- [ ] Check build logs for warnings
- [ ] Monitor error logs in browser console

### Performance
- [ ] API response time < 5 seconds
- [ ] Frontend load time < 3 seconds
- [ ] No database connection timeouts

---

## 🔒 Security Verification

- [ ] API keys never exposed in frontend code
- [ ] `service_role` key only in backend `.env`
- [ ] `anon` key only on frontend
- [ ] `.env` files in `.gitignore` (not committed to git)
- [ ] CORS configured correctly (no overly permissive policies)
- [ ] Rate limiting enabled (100 requests per 15 min)
- [ ] Row-Level Security (RLS) policies working

---

## 📋 Troubleshooting Quick Reference

### If Backend Won't Deploy
- Check Railway logs for error messages
- Verify environment variables are set in Railway dashboard
- Test locally: `cd backend && npm run dev`

### If Frontend Won't Load
- Check Vercel build logs
- Verify `npm run build` works locally
- Check browser console for errors (F12)
- Verify `VITE_BACKEND_URL` is set correctly

### If API Calls Fail
- Check CORS configuration on backend
- Verify backend is running and responding to health checks
- Check browser Network tab to see actual error response
- Verify `VITE_BACKEND_URL` points to correct backend URL

### If Database Not Recording Data
- Verify Supabase credentials are correct
- Check Supabase project is accessible
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in backend
- Check Supabase logs for SQL errors

---

## 📚 Documentation Reference

- **Architecture**: `PRODUCTION.md` - Overall system design
- **Deployment**: `SUPABASE_PRODUCTION_SETUP.md` - Database setup
- **Local Development**: `QUICKSTART.md` - Getting started
- **Supabase**: `/supabase/SETUP.md` - Database details
- **API**: See `backend/routes/analysis.js` for endpoint documentation

---

## ✨ You're Production Ready When:

✅ All checklist items completed
✅ Local testing passes
✅ Backend deployed to Railway
✅ Frontend deployed to Vercel
✅ Database fully configured
✅ End-to-end requests work
✅ Data appears in analytics
✅ No errors in production logs

---

## 🎉 Next Steps (Post-Production)

1. Monitor logs and metrics
2. Set up alerting for errors
3. Plan feature releases
4. Scale infrastructure as needed
5. Gather user feedback
