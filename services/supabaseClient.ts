
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Cloud Client
 *
 * Safely extracts environment variables. If they are missing, the client
 * returns null, allowing the App to fall back to LocalStorage Sandbox mode.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if both keys are present to avoid "supabaseUrl is required" error
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!supabase;
