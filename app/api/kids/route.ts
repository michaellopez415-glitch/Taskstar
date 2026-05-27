import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const getAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('kids').select('*, tasks(*)')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ kids: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Get user ID from auth header OR cookie
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // If cookie auth fails, try getting parent_id from request body
    const body = await req.json()
    const { name, age, emoji, prize_name, prize_emoji, pin, parent_id } = body

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const userId = user?.id || parent_id
    if (!userId) return NextResponse.json({ error: 'Not authenticated. Please log in again.' }, { status: 401 })

    const admin = getAdmin()
    const { data, error } = await admin.from('kids').insert({
      parent_id: userId,
      name: name.trim(),
      age: parseInt(age) || 8,
      emoji: emoji || '🧒',
      prize_name: prize_name || '',
      prize_emoji: prize_emoji || '🎁',
      prize_pct: 0,
      total_stars: 0,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Set PIN if provided
    if (pin && String(pin).length === 4 && data?.id) {
      const pinHash = Buffer.from(String(pin) + data.id).toString('base64')
      await admin.from('kids').update({ pin_hash: pinHash }).eq('id', data.id)
    }

    return NextResponse.json({ kid: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
