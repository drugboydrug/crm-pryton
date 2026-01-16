import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { logAction } from '@/lib/actions'
import { COMMANDS } from '@/lib/commands'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user?.email || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type } = body

  // === VALIDATE COMMAND ===
  const ALLOWED = COMMANDS.map(c => c.id)

  if (!ALLOWED.includes(type)) {
    return NextResponse.json(
      { error: 'Invalid command' },
      { status: 400 }
    )
  }

  // === HEALTH CHECK ===
  if (type === 'health_check') {
    try {
      const test = await supabase
        .from('actions')
        .select('id')
        .limit(1)

      if (test.error) {
        await logAction('health_fail:db', user.email)
        return NextResponse.json({ ok: false })
      }

      await logAction('health_ok', user.email)
      return NextResponse.json({ ok: true })
    } catch {
      await logAction('health_fail:exception', user.email)
      return NextResponse.json({ ok: false })
    }
  }

  // === DANGEROUS COMMAND ===
  if (type === 'reset_system') {
  
    const { confirm } = body

    if (confirm !== 'RESET') {
      await logAction('reset_denied', user.email)
      return NextResponse.json({ ok: false, reason: 'Not confirmed' })
    }

    // здесь в будущем будет реальный reset
    await logAction('reset_executed', user.email)

    // rollback marker
    await logAction('reset_rollback_available', user.email)

    return NextResponse.json({ ok: true })
  }

  // === DEFAULT COMMAND ===
  await logAction(type, user.email)
  return NextResponse.json({ ok: true })
}
