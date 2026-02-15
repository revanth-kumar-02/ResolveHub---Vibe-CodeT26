import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a safe Supabase client that won't throw during build-time prerendering
// when environment variables are not available
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a dummy client during build that won't crash
        // All operations will fail gracefully at runtime
        return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

export const supabase = getSupabaseClient();
