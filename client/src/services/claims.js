import { supabase, getCurrentUserId } from './supabase';

export async function fileClaim({ policyNumber, incidentDate, description, damageEstimate }) {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('claims')
    .insert({
      user_id: userId,
      policy_number: policyNumber,
      incident_date: incidentDate,
      description,
      damage_estimate: damageEstimate || null,
    })
    .select();
  if (error) throw error;
  return data[0];
}

export async function getMyClaims() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllClaims(statusFilter) {
  let query = supabase
    .from('claims')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateClaimStatus(id, status, adminNotes) {
  const { data, error } = await supabase
    .from('claims')
    .update({ status, admin_notes: adminNotes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
}
