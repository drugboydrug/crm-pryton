import { supabase } from '@/lib/supabase-client'

export async function getUserRole(): Promise<'admin' | 'operator' | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_email', user.email)
    .single()

  return data?.role ?? null
}
