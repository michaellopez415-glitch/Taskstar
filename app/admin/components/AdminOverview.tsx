'use client'
import { useState, useEffect } from 'react'

const stats = [
  { label: 'Active Families', value: '247', change: '+12 this week', up: true },
  { label: 'Monthly Revenue', value: '$1,847', change: '+$340 vs last month', up: true },
  { label: 'Tasks Completed', value: '14,832', change: 'Today platform-wide', up: true },
  { label: 'Churn Rate', value: '2.3%', change: '-0.4% vs last month', up: false },
]

const activity = [
  { time: '2m ago', event: 'New signup', detail: 'sarah.jones@gmail.com — Parent', dot: '#6BCB77' },
  { time: '8m ago', event: 'Subscription started', detail: 'mike.chen@outlook.com — $9.99/mo', dot: '#FFD93D' },
  { time: '15m ago', event: 'Trial expired', detail: 'anna.smith@yahoo.com — no conversion', dot: '#FF6B6B' },
  { time: '23m ago', event: 'New signup', detail: 'david.park@gmail.com — Parent', dot: '#6BCB77' },
  { time: '41m ago', event: 'Payment failed', detail: 'lisa.wong@gmail.com — retry scheduled', dot: '#FF6B6B' },
  { time: '1h ago', event: 'Task milestone', detail: 'Family completed 100 tasks!', dot: '#9B72CF' },
]

const topDestinations = [
  { name: 'Daily Tasks', pct: 94 },
  { name: 'Prize Goals', pct: 78 },
  { name: 'Weekly Reports', pct: 61 },
  { name: 'Badges', pct: 45 },
  { name: 'Parent Approval', pct: 32 },
]

export default function AdminOverview() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 500, margin: 0 }}>Command Center</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '4px 0 0', fontFamily: "'DM Mono', monospace" }}>
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {time.toLocaleTimeString()}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(107,203,119,0.1)', border: '1px solid rgba(107,203,119,0.2)', borderRadius: '99px', padding: '6px 14px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6BCB77', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '12px', color: '#6BCB77', fontFamily: "'DM Mono', monospace" }}>All systems live</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '10px' }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: '28px', fontWeight: 500, color: 'white', marginBottom: '6px', fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: s.up ? '#6BCB77' : '#FF6B6B' }}>{s.up ? '↑' : '↓'} {s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Live Activity */}
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>LIVE ACTIVITY</div>
          {activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.dot, marginTop: '5px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{a.event}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}>{a.time}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{a.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Usage */}
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>FEATURE USAGE</div>
          {topDestinations.map((f, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{f.name}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{f.pct}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${f.pct}%`, background: 'linear-gradient(90deg, #FF6B6B, #FF9B6B)', borderRadius: '99px' }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '12px' }}>QUICK ACTIONS</div>
            {['Send announcement to all users', 'Export weekly report CSV', 'View payment failures'].map((a, i) => (
              <button key={i} style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 12px',
                color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', marginBottom: '6px',
                fontFamily: "'DM Sans', sans-serif"
              }}>→ {a}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly trend */}
      <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>SIGNUPS THIS WEEK</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
          {[12, 8, 19, 15, 24, 18, 31].map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '100%', background: i === 6 ? '#FF6B6B' : 'rgba(255,107,107,0.2)', borderRadius: '4px 4px 0 0', height: `${(v / 31) * 64}px`, transition: 'height 0.5s' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}>
                {['M','T','W','T','F','S','S'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
