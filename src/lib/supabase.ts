import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const unavailableFetch: typeof fetch = async () =>
  new Response(JSON.stringify({ message: 'The data service is not configured.' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });

export const supabase = createClient(
  supabaseUrl || 'https://unconfigured.invalid',
  supabaseAnonKey || 'unconfigured-public-key',
  isConfigured ? undefined : { global: { fetch: unavailableFetch } },
);
