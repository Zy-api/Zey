import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Database Client
 *
 * Provides a typed client for the Supabase PostgreSQL database.
 * The anon/publishable key is designed for public frontend use —
 * Row Level Security (RLS) enforces what anonymous users can read/write.
 *
 * Works on ANY static host (Vercel) — no backend needed.
 */

// Fallback values ensure the production build works even without env vars.
// The publishable key is designed for public frontend use (RLS protects the data).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ghazrftexzufpjtdgiya.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_X6jjP50xBNSDDgTavnC52Q_Q2_VShjv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
