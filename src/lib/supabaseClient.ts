import { createClient } from "@supabase/supabase-js";

// Check for required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development when credentials are missing
const createMockClient = () => {
  console.warn('⚠️ Supabase connection failed or not configured. Using mock client for development.');
  console.warn('This could be due to:');
  console.warn('1. Missing credentials in .env file');
  console.warn('2. CORS configuration in Supabase project');
  console.warn('3. Supabase project is paused or unavailable');
  console.warn('4. Network connectivity issues');
  
  return {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  };
};

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    supabaseUrl !== 'your_supabase_url_here' && 
                    supabaseAnonKey !== 'your_supabase_anon_key_here' &&
                    supabaseUrl.startsWith('https://');

// Create Supabase client with error handling
let supabase;

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    
    // Test the connection by attempting to get session
    supabase.auth.getSession().catch((error) => {
      console.error('Supabase connection test failed:', error);
      console.warn('Falling back to mock client due to connection issues');
    });
    
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    supabase = createMockClient();
  }
} else {
  supabase = createMockClient();
}

export { supabase };