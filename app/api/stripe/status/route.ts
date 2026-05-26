import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_end, current_period_end')
    .eq('id', user.id)
    .single()

  const status = profile?.subscription_status || 'none'
  const isActive = ['active', 'trialing'].includes(status)
  const trialEnd = profile?.trial_end
  const periodEnd = profile?.current_period_end

  return NextResponse.json({ status, isActive, trialEnd, periodEnd })
}
