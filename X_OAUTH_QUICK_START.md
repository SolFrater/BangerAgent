# X OAuth Quick Start

Get X OAuth running in 5 minutes. All the setup is done—just configure credentials.

---

## ⚡ TL;DR - 5 Minute Setup

**You need:**
1. X Developer account (5 min to create + get credentials)
2. Supabase project (already set up)
3. Configure Supabase with X credentials (2 min)

**That's it!** OAuth will work immediately.

---

## Step 1: Get X API Credentials (5 minutes)

1. Go to https://developer.twitter.com/
2. Click **"+ Create App"** (under Projects & Apps)
3. Name it: `NicheLens`
4. Accept terms
5. Go to **"Keys and Tokens"** tab
6. Copy:
   - **API Key** (Client ID)
   - **API Key Secret** (Client Secret)

---

## Step 2: Configure Supabase (2 minutes)

### 2a. Enable Twitter OAuth

1. Go to your Supabase Dashboard
2. Click **Authentication** (left sidebar)
3. Click **Providers**
4. Find **Twitter** and toggle **Enable**

### 2b. Add Credentials

Paste into the form:
```
Client ID:     (Your API Key from Step 1)
Client Secret: (Your API Key Secret from Step 1)
```

Click **Save**

### 2c. Add Callback URLs to X Developer Portal

In X Developer Portal → Your App → **Settings** → **Authentication settings**:

```
Callback URLs:
https://your-project-ref.supabase.co/auth/v1/callback
https://nichelens.vercel.app/auth/callback
https://localhost:3000/auth/callback (for local testing)
```

---

## Step 3: Test Locally (1 minute)

1. Start the app:
```bash
npm run dev
```

2. Click **"Authorize X"** button (top right)

3. You'll be redirected to X login

4. After login, you should be back in the app with your profile visible

**Done!** 🎉

---

## Step 4: Deploy to Production (if ready)

### Update Vercel

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Update X Callback URLs

Add production URL to X Developer Portal:
```
https://nichelens.vercel.app/auth/callback
```

---

## ✅ Status

OAuth is **already implemented** in the app:
- ✅ Login button in navbar
- ✅ Supabase integration
- ✅ User session management
- ✅ Profile display with X handle
- ✅ Logout functionality

**What we added:**
- ✅ Complete setup guide
- ✅ Optional modern `AuthContext` (if you want to refactor)
- ✅ Reusable `LoginButton` component
- ✅ OAuth callback handler

---

## Files

| File | Purpose |
|------|---------|
| `X_OAUTH_SETUP.md` | Complete reference guide |
| `frontend/src/contexts/AuthContext.tsx` | Optional: Modern state management |
| `frontend/src/components/LoginButton.tsx` | Optional: Reusable button |
| `frontend/src/pages/AuthCallback.tsx` | Optional: Redirect handler |

---

## Common Issues

### "Callback URI mismatch"
- Make sure URLs in X Developer Portal match exactly
- Include `https://` or `http://`
- No trailing slashes

### "App not authorized"
- Check X API credentials are in Supabase
- Verify Twitter OAuth is enabled in Supabase

### "Not seeing login button"
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check browser console for errors

---

## What Happens When User Logs In

1. User clicks **"Authorize X"**
2. Redirected to X login
3. User authenticates with X
4. X redirects back to your app
5. Supabase stores session
6. Your app shows user profile:
   - X handle (@username)
   - Profile image
   - Display name
7. User data is **isolated by Supabase RLS**
8. All analyses are linked to their account

---

## Next: Move Sandbox to Production ✨

Current state: **Sandbox Mode** (local storage)

After OAuth setup: **Production Mode** (Cloud sync)

When user logs in:
- All their past analyses sync from Supabase
- New analyses automatically saved to cloud
- Data persists across devices
- Analytics tracked per user

---

## Questions?

Refer to: **`X_OAUTH_SETUP.md`** for detailed setup instructions

---

**Everything is ready. Just get your X API credentials and you're live!** 🚀
