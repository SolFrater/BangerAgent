# X (Twitter) OAuth Authentication Setup

Complete guide to configure X OAuth authentication in production with Supabase.

---

## ✅ Status: OAuth Already Implemented

**Great news!** OAuth authentication is already built into BangerAgent:
- ✅ Login button in navbar (`App.tsx:283`)
- ✅ Supabase OAuth flow integrated (`App.tsx:107-110`)
- ✅ User session persistence on page load
- ✅ Logout functionality
- ✅ User profile image and handle display

**This guide helps you:**
1. Get X API credentials from Twitter Developer Portal
2. Configure Supabase OAuth provider with those credentials
3. Verify OAuth works end-to-end in production
4. Optional: Migrate to the new `AuthContext` for cleaner code

---

## Overview

With X OAuth properly configured, users can:
- Sign in with their X/Twitter account (already implemented ✅)
- Automatically have their X handle tracked
- All their analyses linked to their account
- Data isolated by Row-Level Security (RLS) policies

---

## Step 1: Get X API Credentials

### 1a. Create Developer Account

1. Go to https://developer.twitter.com/
2. Sign in with your X/Twitter account (or create one)
3. Click **"Create an app"** or go to Dashboard → Projects & Apps
4. Click **"+ Create App"**
5. Choose an app name (e.g., "BangerAgent")
6. Select app use case: "Other" → "Checking bot activity"
7. Click **"Next"**

### 1b. Fill App Details

```
App name:                    BangerAgent
App description:             AI-powered Twitter engagement analysis
Website URL:                 https://nichelens.vercel.app
Use case:                    Analyzing Twitter engagement
```

### 1c. Get API Keys

1. After creating app, go to **"Keys and Tokens"** tab
2. Under **"API Keys & Tokens"** section:
   - **API Key**: Copy this (also called Consumer Key)
   - **API Key Secret**: Copy this (also called Consumer Secret)
3. Click **"Generate"** under **"Bearer Token"** (you don't need this for OAuth)
4. Scroll down to **"Authentication Tokens & Keys"**
5. Click **"Generate"** button
   - Choose "Read and write" access level
   - Accept terms and generate

⚠️ **IMPORTANT**: You need **OAuth 1.0a** which Twitter provides automatically. We'll use it with Supabase.

### 1d. Set Up OAuth Redirect URLs

1. In Twitter Developer Portal, go to **"App settings"** → **"Authentication settings"**
2. Scroll to **"User authentication settings"**
3. Click **"Enable"** or **"Edit"** (if already enabled)

4. Configure these OAuth 2.0 settings:
   ```
   App type: Web app
   Callback URLs:
   - https://your-project.supabase.co/auth/v1/callback
   - http://localhost:3000/auth/callback (for local development)

   Website URL: https://nichelens.vercel.app
   Terms of service URL: https://nichelens.vercel.app/terms
   Privacy policy URL: https://nichelens.vercel.app/privacy
   ```

5. Save these settings

**Note**: Replace `your-project` with your actual Supabase project ref

You should also enable **OAuth 1.0a User Context** if you plan to use the X API later to fetch user tweets.

---

## Step 2: Configure Supabase OAuth

### 2a. Add X Provider in Supabase

1. Go to Supabase Dashboard → **Authentication** (left sidebar)
2. Click **"Providers"** tab
3. Find **"Twitter"** in the providers list
4. Click to expand it
5. Toggle **"Enable Twitter OAuth"** to ON

### 2b. Enter X API Credentials

In the Twitter provider settings, fill in:

```
Client ID:     (Your X API Key from Step 1)
Client Secret: (Your X API Key Secret from Step 1)
```

Click **"Save"**

### 2c. Set Redirect URLs in Supabase

1. Still in Authentication → Providers
2. Click **"Twitter"** to expand
3. Under **"Authorized redirect URIs"**, you should see:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

This should already be there, but verify it's correct.

4. Add your production URL:
   ```
   https://nichelens.vercel.app/auth/callback
   ```

---

## Step 3: Update Frontend for OAuth

### 3a. Create Auth Context

Create `frontend/src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithX: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signInWithX = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signInWithX, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 3b. Create Auth Callback Page

Create `frontend/src/pages/AuthCallback.tsx`:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Successfully authenticated
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
        <p className="text-white text-lg">Authenticating with X...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
```

### 3c. Create Login Component

Create `frontend/src/components/LoginButton.tsx`:

```typescript
import { useAuth } from '../contexts/AuthContext';

export function LoginButton() {
  const { user, loading, signInWithX, signOut } = useAuth();

  if (loading) {
    return (
      <button className="px-4 py-2 bg-gray-600 text-white rounded opacity-50 cursor-not-allowed">
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">
          @{user.user_metadata?.user_name || user.email}
        </span>
        <button
          onClick={signOut}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithX}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
      Sign in with X
    </button>
  );
}
```

### 3d. Update App.tsx

Wrap your app with AuthProvider and add the callback route:

```typescript
import { AuthProvider } from './contexts/AuthContext';
import { AuthCallback } from './pages/AuthCallback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginButton } from './components/LoginButton';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/"
            element={
              <div>
                <div className="flex justify-end p-4">
                  <LoginButton />
                </div>
                {/* Rest of your app */}
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
```

### 3e. Update Supabase Client

Create `frontend/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Authentication will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Step 4: Update Backend to Use Auth

### 4a. Add User ID to Analytics

Update `backend/middleware/analytics.js` to get user from auth header:

```javascript
const analyticsMiddleware = (supabase) => {
  return async (req, res, next) => {
    const startTime = Date.now();

    // Get user from Authorization header
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const { data } = await supabase.auth.getUser(token);
        userId = data.user?.id;
      } catch (err) {
        // Token invalid, continue without auth
      }
    }

    const originalJson = res.json.bind(res);
    res.json = function (data) {
      const duration = Date.now() - startTime;
      const endpoint = req.path;
      const method = req.method;
      const statusCode = res.statusCode;

      // Log to database if user is authenticated
      if (supabase && userId) {
        supabase
          .from('analytics_logs')
          .insert({
            user_id: userId,
            endpoint,
            method,
            status_code: statusCode,
            duration_ms: duration,
            timestamp: new Date().toISOString(),
          })
          .catch((err) => {
            console.error('[Analytics Error]', err.message);
          });
      }

      return originalJson(data);
    };

    next();
  };
};

export default analyticsMiddleware;
```

### 4b. Update API Client to Send Auth Token

Update `frontend/src/services/apiClient.ts`:

```typescript
import { useAuth } from '../contexts/AuthContext';

// ... existing code ...

async function callBackendAPI(
  endpoint: string,
  payload: any,
  token?: string
): Promise<any> {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/analysis${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend error (${response.status}): ${error}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Backend request failed');
  }

  return data.data;
}

// Update analyzeContent to get token from auth context
export async function analyzeContent(
  mode: 'post' | 'reply' | 'audit' | 'niche' | 'ideate',
  input: string,
  handle: string = 'user',
  token?: string
): Promise<any> {
  // ... existing code ...
  // Pass token to callBackendAPI
  return await callBackendAPI(..., { ... }, token);
}
```

---

## Step 5: Environment Variables

Add to `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Step 6: User Profile Setup

### 6a. Create User Profile on First Login

Create `frontend/src/lib/createUserProfile.ts`:

```typescript
import { supabase } from './supabase';

export async function createUserProfileIfNeeded(userId: string, userEmail: string) {
  // Check if profile exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existing) return; // Already exists

  // Create profile
  const { error } = await supabase.from('user_profiles').insert({
    id: userId,
    email: userEmail,
    created_at: new Date().toISOString(),
    quota_requests: 0,
    quota_limit: 100, // 100 free requests/month
  });

  if (error) console.error('Error creating profile:', error);
}
```

Call this in AuthContext after user logs in:

```typescript
useEffect(() => {
  if (user) {
    createUserProfileIfNeeded(user.id, user.email || '');
  }
}, [user]);
```

---

## Step 7: Database User Profiles Migration

Update user_profiles table to include X handle:

```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS x_handle TEXT,
ADD COLUMN IF NOT EXISTS x_followers_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_auth_at TIMESTAMP WITH TIME ZONE;

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email
ON public.user_profiles(email);
```

---

## Step 8: Testing OAuth Locally

### Test with Local Development

1. Ensure Supabase client is configured:
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

2. Add localhost callback to X Developer Portal:
```
Callback URLs:
- http://localhost:3000/auth/callback
- https://your-project.supabase.co/auth/v1/callback
```

3. Start frontend:
```bash
npm run dev
```

4. Click "Sign in with X" button
5. You'll be redirected to X login
6. After login, you'll be redirected back to your app
7. Check browser DevTools → Application → Cookies for `sb-` tokens (Supabase session)

---

## Step 9: Production Deployment

### Update Vercel Environment Variables

Add to Vercel dashboard:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Update X Developer Portal OAuth Callback

Add your production URL:

```
Callback URLs:
- https://nichelens.vercel.app/auth/callback
- https://your-project.supabase.co/auth/v1/callback
```

### Update Backend in Railway

Backend automatically gets user context from Authorization header. No changes needed if using token-based auth.

---

## Step 10: Advanced - Link X Account Data

If you want to fetch user's X tweets later:

```typescript
// Create a database table for storing X API tokens
CREATE TABLE public.user_x_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  x_access_token TEXT NOT NULL,
  x_access_token_secret TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT user_x_tokens_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.user_x_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can read their own X tokens" ON public.user_x_tokens
  FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Troubleshooting

### "Invalid OAuth client"
- Verify Client ID and Secret are correct
- Check they're not expired in X Developer Portal

### "Redirect URI mismatch"
- Ensure callback URLs match exactly in X Developer Portal
- Include http:// or https://
- No trailing slashes

### "OAuth provider not enabled"
- Go to Supabase Authentication → Providers
- Toggle Twitter provider ON
- Save settings

### "User not authenticating locally"
- Add `http://localhost:3000/auth/callback` to X Developer Portal
- Check browser console for errors
- Verify Supabase credentials are correct

### "Session lost after page refresh"
- Supabase should handle this automatically
- Check browser cookies are not blocked
- Verify Supabase client is initialized in AuthContext

---

## Current Implementation in BangerAgent

The OAuth flow is **already implemented** in `App.tsx`:

```typescript
// 1. On app load, check for existing session (lines 42-64)
useEffect(() => {
  if (isSupabaseConfigured && supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleUserSession(session.user);
      }
    });
  }
}, []);

// 2. User clicks "Authorize X" button (line 283)
// 3. Redirected to X login
// 4. X redirects back to app with session
// 5. handleUserSession() extracts:
//    - user.id (Supabase user ID)
//    - user_metadata?.user_name (X handle)
//    - user_metadata?.avatar_url (Profile image)
```

**To enable OAuth in production, you only need:**
1. ✅ Steps 1-9 above (X credentials + Supabase config)
2. ✅ Environment variables in Vercel and Railway
3. ✅ Test the login flow

---

## Optional: Migrate to New AuthContext

We've created a modern `AuthContext` in `frontend/src/contexts/AuthContext.tsx` that provides:
- Cleaner hook-based API: `const { user, signInWithX, signOut } = useAuth()`
- Type-safe authentication state
- Automatic session persistence
- Error handling

**If you want to use it:**

1. Wrap your app with `AuthProvider`:
```typescript
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  );
}
```

2. Use the hook in components:
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, signInWithX, signOut } = useAuth();

  if (!user) {
    return <button onClick={signInWithX}>Sign In</button>;
  }

  return <div>Welcome @{user.user_name}</div>;
}
```

**Files created:**
- `frontend/src/contexts/AuthContext.tsx` - State management
- `frontend/src/components/LoginButton.tsx` - Reusable button component
- `frontend/src/pages/AuthCallback.tsx` - OAuth redirect handler
- `frontend/src/lib/supabase.ts` - Supabase client initialization

The existing `App.tsx` will continue to work as-is. The new context is optional for gradual refactoring.

---

## Security Notes

- ✅ Tokens stored securely in Supabase
- ✅ Only frontend accesses OAuth (backend gets token)
- ✅ RLS policies isolate user data
- ✅ X API credentials stored in Supabase (not in frontend)
- ⚠️ Never commit `.env.local` with real credentials
- ⚠️ Keep API Secret secure - only in backend/Supabase

---

## Production Checklist

Before deploying OAuth to production:

- [ ] X Developer account created with app credentials
- [ ] X App has OAuth 1.0a enabled
- [ ] Callback URLs added to X Developer Portal:
  - `https://your-project.supabase.co/auth/v1/callback`
  - `https://nichelens.vercel.app/auth/callback`
- [ ] Supabase OAuth provider enabled and configured
- [ ] Client ID and Secret in Supabase (not exposing Secret on frontend)
- [ ] `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Vercel environment variables updated with Supabase config
- [ ] Railway environment variables updated (if needed)
- [ ] Local testing: "Authorize X" button works
- [ ] Production testing: OAuth redirect works on Vercel URL
- [ ] User data persists after page refresh

---

## Next Steps

1. ✅ Get X API credentials (Sections 1-3)
2. ✅ Configure Supabase OAuth (Sections 4-5)
3. ✅ Test locally (Section 8)
4. ✅ Deploy to production (Section 9)
5. ⏭️ Monitor user logins
6. ⏭️ (Optional) Store X user metadata for deeper integration
7. ⏭️ (Optional) Fetch user's recent tweets via X API v2

All data is isolated per user via Row-Level Security! 🔒
