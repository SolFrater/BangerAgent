# BangerAgent: Production Deployment Quick Start

**TL;DR**: Complete production-ready AI engagement engine. Deploy in 30 minutes.

---

## 🚀 What You're Deploying

A three-tier production application:

```
┌─────────────────────────────────────────┐
│  Frontend (Vercel)                      │
│  - React + TypeScript + Tailwind        │
│  - Tweet optimization, audit, strategy  │
└──────────┬──────────────────────────────┘
           │ API calls
           │ (VITE_BACKEND_URL)
           ▼
┌──────────────────────────────────────────────┐
│  Backend (Railway)                           │
│  - Express.js + Node.js                      │
│  - Claude Haiku AI integration               │
│  - Rate limiting + Analytics logging         │
└──────────┬───────────────────────────────────┘
           │ Database
           │ (SUPABASE_URL + SUPABASE_SERVICE_KEY)
           ▼
┌──────────────────────────────────────────────┐
│  Database (Supabase PostgreSQL)              │
│  - user_profiles (account data)              │
│  - analytics_logs (request tracking)         │
│  - analysis_history (results storage)        │
└──────────────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

**Local Environment:**
```bash
# 1. Dependencies installed?
cd backend && npm install && cd ..
npm install

# 2. Can you build?
npm run build  # Should create dist/ folder

# 3. Does backend start?
cd backend && npm run dev  # Should say "🚀 Backend running on port 5000"

# 4. Does frontend start?
npm run dev  # Should say "VITE ... ready"

# 5. Can backend receive requests?
curl http://localhost:5000/health  # Should return {"status":"ok",...}
```

**API Keys Ready:**
- [ ] Anthropic API key (from https://console.anthropic.com)
- [ ] Supabase project credentials (from https://supabase.com/dashboard)
- [ ] GitHub repo connected to Vercel & Railway

---

## 🎯 30-Minute Deployment Path

### 5 min: Create Accounts
```
1. Railway: https://railway.app/dashboard → Import GitHub
2. Vercel: https://vercel.com → Import GitHub
3. Supabase: https://supabase.com/dashboard → New Project
```

### 10 min: Run Database Migrations
```
1. Go to Supabase SQL Editor
2. Run: supabase/migrations/001_create_user_profiles.sql
3. Run: supabase/migrations/002_create_analytics_logs.sql
4. Run: supabase/migrations/003_create_analysis_history.sql
5. Verify: Table Editor should show 3 new tables
```

### 7 min: Deploy Backend (Railway)
```
1. Click "New Project" → "Deploy from GitHub"
2. Select: SolFrater/BangerAgent
3. Configure environment:
   ANTHROPIC_API_KEY=sk-ant-api03-...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGc...
   NODE_ENV=production
4. Deploy (auto-detects backend/railway.toml)
5. Copy deployed URL from dashboard
```

### 7 min: Deploy Frontend (Vercel)
```
1. Click "New Project" → "Import GitHub"
2. Select: SolFrater/BangerAgent
3. Configure environment:
   VITE_BACKEND_URL=https://your-railway-url
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
4. Deploy
5. Visit your Vercel URL
```

### 1 min: Verify
```bash
# Test API
curl -X POST https://your-backend.railway.app/api/analysis/optimize \
  -H "Content-Type: application/json" \
  -d '{"input":"I made $10k working 2 hours a week"}'

# Should return: {"success":true,"data":{...variations...}}
```

---

## 📁 Project Structure

```
BangerAgent/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   ├── components/          # UI components
│   │   │   ├── SettingsPanel.tsx
│   │   │   ├── HistoryDrawer.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── services/
│   │       └── apiClient.ts     # Backend API calls
│   ├── .env.local               # Frontend env vars (DEV)
│   ├── .env.example             # Template
│   └── package.json
│
├── backend/
│   ├── server.js                # Express app + Supabase init
│   ├── routes/
│   │   └── analysis.js          # API endpoints (optimize, reply, audit, niche, ideate)
│   ├── middleware/
│   │   ├── rateLimit.js         # 100 req/15min per IP
│   │   └── analytics.js         # Logs to Supabase
│   ├── .env                     # Backend env vars (KEEP SECRET!)
│   ├── .env.example             # Template
│   ├── railway.toml             # Railway deployment config
│   ├── package.json
│   └── Dockerfile               # Container image
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_user_profiles.sql
│   │   ├── 002_create_analytics_logs.sql
│   │   └── 003_create_analysis_history.sql
│   └── SETUP.md
│
├── docs/
│   ├── PRODUCTION.md            # Full architecture & deployment guide
│   ├── SUPABASE_PRODUCTION_SETUP.md  # Database setup guide
│   ├── DEPLOYMENT_CHECKLIST.md  # Step-by-step verification
│   ├── QUICKSTART.md            # Local dev setup
│   └── DEPLOYMENT_QUICK_START.md # This file
│
├── vercel.json                  # Vercel deployment config
├── docker-compose.yml           # Local dev orchestration
├── .gitignore                   # .env.local, .env, node_modules, etc.
└── README.md                    # Project overview
```

---

## 🔑 Environment Variables Summary

### Frontend: `.env.local`
| Variable | Where | Example |
|----------|-------|---------|
| `VITE_BACKEND_URL` | Backend URL | `https://your-app.railway.app` |
| `VITE_SUPABASE_URL` | Supabase Project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGc...` |

### Backend: `backend/.env` ⚠️ KEEP SECRET
| Variable | Where | Example |
|----------|-------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `ANTHROPIC_API_KEY` | Claude API | `sk-ant-api03-...` |
| `SUPABASE_URL` | Supabase Project URL | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service key | `eyJhbGc...` (SECRET!) |

**⚠️ SECURITY:**
- Never commit `backend/.env` to git
- `service_role` key must ONLY be on backend
- Frontend uses `anon` key (safe to expose)
- Supabase Row-Level Security (RLS) enforces user isolation

---

## 🧪 Testing After Deployment

### Test 1: API Health
```bash
curl https://your-backend.railway.app/health
# Expected: {"status":"ok","timestamp":"2024-..."}
```

### Test 2: API Response
```bash
curl -X POST https://your-backend.railway.app/api/analysis/optimize \
  -H "Content-Type: application/json" \
  -d '{"input":"Test tweet"}'
# Expected: {"success":true,"data":{variations:[...]}}
```

### Test 3: Frontend UI
1. Open https://your-frontend.vercel.app
2. Enter text: "I made $10k working 2 hours a week"
3. Click "Optimize Tweet"
4. Should see 3 variations within 5 seconds

### Test 4: Database Logging
1. Open Supabase Table Editor
2. Click `analysis_history` table
3. Should see recent rows from your test requests
4. Click `analytics_logs` table
5. Should see performance metrics logged

---

## 🎯 API Endpoints

All endpoints are on `/api/analysis`:

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/optimize` | POST | `{input: "tweet"}` | 3 tweet variations |
| `/reply` | POST | `{input: "source tweet"}` | Strategic reply options |
| `/audit` | POST | `{tweets: [], handle: "@user"}` | Account analysis |
| `/niche` | POST | `{tweets: [], handle: "@user"}` | Niche mapping |
| `/ideate` | POST | `{input: "topic"}` | Content strategy + threads + polls |

Example:
```bash
curl -X POST https://backend.railway.app/api/analysis/ideate \
  -H "Content-Type: application/json" \
  -d '{"input":"AI productivity tools for creators"}'
```

---

## 📊 Database Schema

### `user_profiles` table
- Stores user account data
- Linked to Supabase auth
- Tracks API usage quotas
- Row-Level Security: Users see only their profile

### `analytics_logs` table
- Every API request logged
- Performance metrics (duration_ms)
- Error tracking (error_message)
- Indexed for fast queries
- Row-Level Security: Users see only their requests

### `analysis_history` table
- Stores all analysis results
- Stores input, model, results as JSON
- Full-text searchable
- Row-Level Security: Users see only their history

---

## 🆘 Troubleshooting

### "Backend URL not reachable"
```
1. Check Vercel env var: VITE_BACKEND_URL
2. Test manually: curl https://your-backend.railway.app/health
3. Check Railway logs for errors
```

### "API key is invalid"
```
1. Verify ANTHROPIC_API_KEY in Railway dashboard
2. Confirm it starts with "sk-ant-api03-"
3. Check it hasn't expired in console.anthropic.com
```

### "Supabase not connected"
```
1. Verify SUPABASE_URL and SUPABASE_SERVICE_KEY in Railway
2. Test migrations ran: Check Supabase Table Editor
3. Confirm RLS policies are set
```

### "No data appearing in analytics"
```
1. Check Supabase credentials are correct
2. Verify migrations ran (all 3 tables exist)
3. Make a test API call
4. Check analytics_logs table in Supabase
5. Check backend logs for errors
```

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| `PRODUCTION.md` | Complete architecture, deployment strategies, costs, custom domains |
| `SUPABASE_PRODUCTION_SETUP.md` | Detailed Supabase configuration guide |
| `DEPLOYMENT_CHECKLIST.md` | Complete verification checklist |
| `QUICKSTART.md` | Local development setup |
| `/supabase/SETUP.md` | Database schema details |

---

## ✨ You're Live When:

✅ Backend responds to `/health` endpoint
✅ Frontend loads at Vercel URL
✅ API calls work end-to-end (frontend → backend → Claude → response)
✅ Data appears in Supabase tables
✅ No errors in Railway or Vercel logs

---

## 🎉 What's Next?

1. **Monitor**: Watch logs in Railway and Vercel
2. **Scale**: Add caching or CDN if needed
3. **Enhance**: Add authentication (OAuth), custom branding
4. **Analyze**: Check analytics in Supabase for usage patterns
5. **Iterate**: Deploy new features via git pushes

---

## 🔗 Quick Links

- **Anthropic API**: https://console.anthropic.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Claude Docs**: https://docs.anthropic.com
- **Supabase Docs**: https://supabase.com/docs

---

**Time to production: ~30 minutes** ⏱️

Let's go! 🚀
