import { supabase } from './supabase';

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { name },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  // Ensure profile row exists after sign-in
  await ensureProfile();
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.warn('Profile fetch failed:', error.message);
    // If profile doesn't exist yet, try to create it
    if (error.code === 'PGRST116') {
      return await ensureProfile();
    }
    return null;
  }
  return data;
}

async function ensureProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const name = user.user_metadata?.name || user.email || 'User';
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, name }, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.warn('Profile upsert failed:', error.message);
    return null;
  }
  return data;
}
