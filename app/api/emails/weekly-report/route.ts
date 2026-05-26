import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'



export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { parent_id } = await req.json()
  const supabase = await createServerSupabaseClient()

  const { data: parent } = await supabase.from('profiles').select('full_name, email').eq('id', parent_id).single()
  const { data: kids } = await supabase.from('kids').select('*, tasks(*)').eq('parent_id', parent_id)
  if (!parent || !kids) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)

  const kidsHtml = kids.map((kid: any) => {
    const allTasks = kid.tasks || []
    const weekTasks = allTasks.filter((t: any) => t.completed_at && new Date(t.completed_at) >= weekStart)
    const totalTasks = allTasks.length
    const doneTasks = allTasks.filter((t: any) => t.done).length
    const rate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
    const totalStars = weekTasks.reduce((sum: number, t: any) => sum + (t.stars || 0), 0)
    const grade = rate >= 90 ? '🏆 Superstar' : rate >= 70 ? '⭐ Great Job' : rate >= 50 ? '💪 Keep Going' : '📣 Needs Boost'

    return `<div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;border-top:4px solid #9B72CF">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0;color:#2D2A4A">${kid.emoji} ${kid.name}</h3>
        <span style="background:#F0E6FF;color:#9B72CF;padding:4px 12px;border-radius:50px;font-size:.85rem;font-weight:700">${grade}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:16px;text-align:center">
        <div style="background:#F7F8FC;border-radius:12px;padding:12px">
          <div style="font-size:1.8rem;font-weight:900;color:#6BCB77">${doneTasks}/${totalTasks}</div>
          <div style="font-size:.75rem;color:#888">Tasks Done</div>
        </div>
        <div style="background:#F7F8FC;border-radius:12px;padding:12px">
          <div style="font-size:1.8rem;font-weight:900;color:#FF6B6B">${rate}%</div>
          <div style="font-size:.75rem;color:#888">Completion</div>
        </div>
        <div style="background:#F7F8FC;border-radius:12px;padding:12px">
          <div style="font-size:1.8rem;font-weight:900;color:#FFD93D">⭐${kid.total_stars}</div>
          <div style="font-size:.75rem;color:#888">Total Stars</div>
        </div>
      </div>
      <p style="margin:12px 0 0;font-size:.85rem;color:#7a5c00;background:#FFF9C4;padding:8px 12px;border-radius:8px">
        🎯 ${kid.prize_emoji} ${kid.prize_name} · ${kid.prize_pct}% complete
      </p>
    </div>`
  }).join('')

  const totalDone = kids.reduce((s: number, k: any) => s + (k.tasks || []).filter((t: any) => t.done).length, 0)
  const totalAll = kids.reduce((s: number, k: any) => s + (k.tasks || []).length, 0)
  const overallRate = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0
  const weekLabel = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const html = `<div style="font-family:sans-serif;background:#F7F8FC;padding:32px;max-width:600px;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <h1 style="font-size:2rem;color:#2D2A4A;margin:0">Task<span style="color:#FF6B6B">Star</span> ⭐</h1>
      <p style="color:#888;margin:4px 0 0">Weekly Report · Week of ${weekLabel}</p>
    </div>
    <div style="background:linear-gradient(135deg,#2D2A4A,#4a4570);border-radius:20px;padding:24px;margin-bottom:24px;text-align:center;color:white">
      <div style="font-size:3rem;font-weight:900">${overallRate}%</div>
      <div style="opacity:.8;margin-top:4px">Family Completion Rate This Week</div>
      <div style="margin-top:8px;font-size:.9rem;opacity:.7">${totalDone} of ${totalAll} total tasks completed</div>
    </div>
    <p style="color:#2D2A4A;margin-bottom:20px">Hi ${parent.full_name}! Here's your family's weekly scorecard:</p>
    ${kidsHtml}
    <p style="text-align:center;color:#aaa;font-size:.8rem;margin-top:24px">TaskStar · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#FF6B6B">Open App</a></p>
  </div>`

  const { error } = await resend.emails.send({
    from: 'TaskStar <reports@taskstar.app>',
    to: parent.email,
    subject: `📊 Weekly Family Report — ${overallRate}% completion!`,
    html,
  })
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ message: 'Weekly report sent!' })
}
