# BangerAgent - Premium X Engagement AI Engine

An AI-powered platform for content creators and crypto enthusiasts to optimize their X (Twitter) presence using Claude AI.

## Features

- **Post Optimization** (Forge) - Transform raw ideas into viral tweets with multiple variations
- **Strategic Replies** (Reply) - Craft responses designed to maximize engagement
- **Profile Auditing** (Audit) - Analyze your account health and get improvement recommendations
- **Niche Mapping** (Map) - Identify your content pillars and audience opportunities
- **Content Strategy** (Architect) - Generate comprehensive content plans and thread structures
- **Cloud Storage** - Persistent history via Supabase (or local fallback)
- **Rate Limiting** - API protection with configurable quotas
- **Analytics** - Track usage patterns and performance metrics

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude 3.5 Sonnet
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase OAuth (Twitter/X, Google, etc.)

## Quick Start

### Prerequisites
- Node.js 18+
- Anthropic Claude API key
- (Optional) Supabase account for cloud features

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local (see .env.example)
cp .env.example .env.local

# Add your API keys to .env.local:
# ANTHROPIC_API_KEY=your_key_here
# SUPABASE_URL=your_project_url (optional)
# SUPABASE_ANON_KEY=your_anon_key (optional)

# Run development server
npm run dev
```

App will be available at `http://localhost:3000`

### 2. Backend Setup (Optional but Recommended)

```bash
cd backend

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Add your API keys

# Run backend server
npm run dev
```

Backend will be available at `http://localhost:5000`

### 3. Supabase Setup (Optional for Cloud Features)

Configure Supabase environment variables for cloud features (optional).

## Project Structure

```
├── App.tsx                    # Main React component
├── components/                # UI components
├── services/
│   ├── claudeService.ts      # Claude API integration
│   ├── apiClient.ts          # API orchestration
│   └── supabaseClient.ts     # Supabase setup
├── types.ts                   # TypeScript definitions
├── backend/                   # Express API server
│   ├── server.js
│   ├── routes/
│   └── middleware/
└── supabase/                  # Database migrations
    └── migrations/
```

## API Endpoints

If running backend:

- `POST /api/analysis/optimize` - Optimize tweets
- `POST /api/analysis/reply` - Generate replies
- `POST /api/analysis/audit` - Audit profile
- `POST /api/analysis/niche` - Analyze niche
- `POST /api/analysis/ideate` - Generate ideas
- `GET /health` - Health check

## Configuration

See `.env.example` for all available options:

**Required:**
- `ANTHROPIC_API_KEY` - Your Claude API key

**Optional:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase public key
- `SUPABASE_SERVICE_KEY` - Supabase service key (backend only)

## Deployment

### Frontend
- Vercel: `vercel deploy`
- Netlify: `netlify deploy --prod`
- Docker: See `.dockerfile`

### Backend
- Railway: Connect GitHub repo and deploy
- Render: Create web service pointing to `backend/server.js`
- Docker: Build and push container

## Development

```bash
# Build frontend
npm run build

# Preview build
npm run preview

# Backend dev mode with auto-reload
cd backend && npm run dev
```

## Common Issues

**"supabaseUrl is required"**
- Either configure Supabase vars in .env.local or leave them blank for local-only mode

**"ANTHROPIC_API_KEY is missing"**
- Make sure to add your Claude API key to .env.local

**Backend connection fails**
- Ensure backend is running on port 5000
- Check that API endpoint URLs in frontend point to correct backend

## Monitoring & Analytics

With Supabase configured, view analytics in the dashboard:
- User activity trends
- API usage by endpoint
- Performance metrics
- Error rates

## License

MIT
