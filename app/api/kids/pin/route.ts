import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { kid_id, pin } = await req.json()
    if (!kid_id || !pin || String(pin).length !== 4) return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 })

    const { data: kid } = await supabase.from('kids').select('id, parent_id').eq('id', kid_id).single()
    if (!kid || kid.parent_id !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const pinHash = Buffer.from(String(pin) + kid_id).toString('base64')
    await getAdmin().from('kids').update({ pin_hash: pinHash }).eq('id', kid_id)

    return NextResponse.json({ message: 'PIN set!' })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function PUT(req: Request) {
  try {
    const { name, pin } = await req.json()
    if (!name || !pin) return NextResponse.json({ error: 'Name and PIN required' }, { status: 400 })

    const { data: kids } = await getAdmin()
      .from('kids')
      .select('*, tasks(*)')
      .ilike('name', name.trim())

    if (!kids || kids.length === 0) return NextResponse.json({ error: 'Child not found. Ask your parent to add you!' }, { status: 404 })

    const kid = kids.find(k => {
      if (!k.pin_hash) return false
      return k.pin_hash === Buffer.from(String(pin) + k.id).toString('base64')
    })

    if (!kid) return NextResponse.json({ error: 'Wrong PIN. Try again!' }, { status: 401 })
    return NextResponse.json({ kid })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
