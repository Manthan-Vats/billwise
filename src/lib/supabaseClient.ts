import { createClient } from "@supabase/supabase-js";

// Check for required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. Please check your .env file and ensure it contains your actual Supabase project URL.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your .env file and ensure it contains your actual Supabase anonymous key.'
  );
}

// Supabase client initialized with environment variables.
// Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your `.env.local` (not committed)

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
