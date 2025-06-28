import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveUser(email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email }])
    .select()
    .single();

  return { data, error };
}

export async function saveDilekce(userId: string, type: string, content: string) {
  const { data, error } = await supabase
    .from('dilekce')
    .insert([{ user_id: userId, type, content }])
    .select()
    .single();

  return { data, error };
}

export async function incrementStats() {
  const { data, error } = await supabase.rpc('increment_total_dilekce');
  return { data, error };
}