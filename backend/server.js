import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import rateLimitMiddleware from './middleware/rateLimit.js';
import analyticsMiddleware from './middleware/analytics.js';
import analysisRoutes from './routes/analysis.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client (optional - can work without it in dev)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  console.log('✓ Supabase connected');
} else {
  console.log('⚠️  Supabase not configured - analytics disabled');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(analyticsMiddleware(supabase));
app.use(rateLimitMiddleware);

// Make supabase client available to routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/analysis', analysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`🚀 NicheLens Backend running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
