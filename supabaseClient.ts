
import { createClient } from '@supabase/supabase-js';

// Helper to get env vars from either Vite's import.meta.env or standard process.env
const getEnvVar = (key: string): string | undefined => {
  try {
    // Check Vite
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    // Ignore error
  }

  try {
    // Check process.env (standard)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error
  }

  return undefined;
};

// 1. Get URL
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://wumwjhdzihawygsmwfkn.supabase.co';

// 2. Get Key
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'sb_publishable__z3ywGpyTpu8S4FKNCvEoA_Uv0hfbcD';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.warn('Supabase URL or Key is missing or invalid. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Check connection
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Supabase connected:', session?.user?.email);
  }
});

// Simple connectivity check
(async () => {
    try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error && error.code !== 'PGRST116') { // Ignore "Results contain 0 rows" if table exists but empty
             console.error('Supabase Connection Error:', error.message);
        } else {
             console.log('Supabase Connection Verified');
        }
    } catch (err) {
        console.error('Supabase Connectivity Exception:', err);
    }
})();
