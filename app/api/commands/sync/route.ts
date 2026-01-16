import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { logAction } from '@/lib/actions'
import { ACTIONS } from '@/lib/action-types'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // тут потом будет реальная логика
  await logAction(ACTIONS.SYNC, user.email)

  return NextResponse.json({ success: true })
}
