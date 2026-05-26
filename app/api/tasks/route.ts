import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { kid_id, label, frequency, stars, icon } = await req.json()

  // Support assigning to ALL kids
  if (kid_id === 'all') {
    const { data: kids } = await supabase.from('kids').select('id').eq('parent_id', user.id)
    if (kids) {
      const inserts = kids.map(k => ({ kid_id: k.id, label, frequency, stars: stars || 5, icon: icon || '✅', done: false }))
      const { error } = await supabase.from('tasks').insert(inserts)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Task added to all kids!' })
  }

  const { data, error } = await supabase.from('tasks').insert({
    kid_id, label, frequency, stars: stars || 5, icon: icon || '✅', done: false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ task: data })
}

export async function PATCH(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { task_id, done } = await req.json()

  const { data: task } = await supabase.from('tasks').select('*, kids(parent_id, total_stars, prize_pct)').eq('id', task_id).single()
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  await supabase.from('tasks').update({ done, completed_at: done ? new Date().toISOString() : null }).eq('id', task_id)

  // Update kid's star count and prize progress
  const starDelta = done ? task.stars : -task.stars
  const newStars = Math.max(0, (task.kids.total_stars || 0) + starDelta)
  const newPct = Math.min(100, Math.max(0, (task.kids.prize_pct || 0) + (done ? 4 : -4)))

  await supabase.from('kids').update({ total_stars: newStars, prize_pct: newPct }).eq('id', task.kid_id)

  return NextResponse.json({ message: 'Task updated', stars: newStars, prize_pct: newPct })
}

export async function DELETE(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { task_id } = await req.json()
  const { error } = await supabase.from('tasks').delete().eq('id', task_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: 'Task deleted' })
}
