import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'



export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { parent_id } = await req.json()
  const supabase = await createServerSupabaseClient()

  const { data: parent } = await supabase.from('profiles').select('full_name, email').eq('id', parent_id).single()
  const { data: kids } = await supabase.from('kids').select('*, tasks(*)').eq('parent_id', parent_id)
  if (!parent || !kids) return NextResponse.json({ error: 'Data not found' }, { status: 404 })

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const kidsHtml = kids.map((kid: any) => {
    const daily = (kid.tasks || []).filter((t: any) => t.frequency === 'Daily')
    const done = daily.filter((t: any) => t.done).length
    const total = daily.length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    const badge = pct === 100 ? '🏆' : pct >= 50 ? '⭐' : '💪'
    const rows = daily.map((t: any) =>
      `<tr><td style="padding:6px 10px">${t.done ? '✅' : '⬜'}</td><td style="padding:6px 10px;color:${t.done ? '#aaa' : '#333'};text-decoration:${t.done ? 'line-through' : 'none'}">${t.label}</td><td style="padding:6px 10px;color:#7a6200">+${t.stars}⭐</td></tr>`
    ).join('')
    return `<div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;border-top:4px solid #6BCB77">
      <h3 style="margin:0 0 4px;color:#2D2A4A">${kid.emoji} ${kid.name} ${badge}</h3>
      <p style="color:#888;font-size:.85rem;margin:0 0 10px">${done}/${total} tasks done today</p>
      <div style="background:#eee;border-radius:50px;height:10px;margin-bottom:14px"><div style="background:#6BCB77;width:${pct}%;height:10px;border-radius:50px"></div></div>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin:12px 0 0;font-size:.85rem;color:#7a5c00;background:#FFF9C4;padding:8px 12px;border-radius:8px">🎯 Prize: ${kid.prize_emoji} ${kid.prize_name} · ${kid.prize_pct}% there!</p>
    </div>`
  }).join('')

  const html = `<div style="font-family:sans-serif;background:#F7F8FC;padding:32px;max-width:600px;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <h1 style="font-size:2rem;color:#2D2A4A;margin:0">Task<span style="color:#FF6B6B">Star</span> ⭐</h1>
      <p style="color:#888;margin:4px 0 0">Daily Report · ${today}</p>
    </div>
    <p style="color:#2D2A4A;margin-bottom:20px">Hi ${parent.full_name}! Here's today's family summary:</p>
    ${kidsHtml}
    <p style="text-align:center;color:#aaa;font-size:.8rem;margin-top:24px">TaskStar · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#FF6B6B">Open App</a></p>
  </div>`

  const { error } = await resend.emails.send({
    from: 'TaskStar <reports@taskstar.app>',
    to: parent.email,
    subject: `⭐ Daily Report — ${today}`,
    html,
  })
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ message: 'Daily report sent!' })
}
