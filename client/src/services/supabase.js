import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null);

const ANONYMOUS_ID = '00000000-0000-0000-0000-000000000000';

export async function getCurrentUserId() {
  if (import.meta.env.VITE_SKIP_AUTH === 'true') return ANONYMOUS_ID;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('לא מחובר');
  return user.id;
}
