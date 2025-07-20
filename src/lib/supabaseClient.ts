import { createClient } from "@supabase/supabase-js";

// Supabase client initialized with environment variables.
// Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your `.env.local` (not committed)

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      detectSessionInUrl: true
    },
  }
);
