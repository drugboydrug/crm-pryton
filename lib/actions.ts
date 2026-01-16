import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function logAction(type: string, email: string) {
  const supabase = await createSupabaseServerClient()

  await supabase.from('actions').insert({
    user_email: email,
    type,
  })
}

export async function getActions(limit = 20) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data
}
