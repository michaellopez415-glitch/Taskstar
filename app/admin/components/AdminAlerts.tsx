'use client'
import { useState } from 'react'

const alerts = [
  { type: 'Payment Failed', msg: 'lisa.wong@gmail.com payment failed 3x — cancel risk', time: '2h ago', severity: 'high', resolved: false },
  { type: 'Trial Expiring', msg: '8 trials expire in the next 48 hours — send conversion email', time: '4h ago', severity: 'medium', resolved: false },
  { type: 'New Signup', msg: 'david.park@gmail.com joined — 4 kids family', time: '6h ago', severity: 'info', resolved: true },
  { type: 'Churn Risk', msg: 'anna.smith@yahoo.com — no login in 14 days', time: '1d ago', severity: 'medium', resolved: false },
  { type: 'Security', msg: '2 failed login attempts from IP 203.45.67.89 — auto-blocked', time: '1d ago', severity: 'high', resolved: true },
  { type: 'Milestone', msg: 'Platform hit 14,000 total tasks completed!', time: '2d ago', severity: 'info', resolved: true },
]

const sevColor: Record<string, string> = { high: '#FF6B6B', medium: '#FFD93D', info: '#6BCB77' }
const sevBg: Record<string, string> = { high: 'rgba(255,107,107,0.08)', medium: 'rgba(255,217,61,0.08)', info: 'rgba(107,203,119,0.08)' }

export default function AdminAlerts() {
  const [filter, setFilter] = useState('all')
  const filtered = alerts.filter(a => filter === 'all' ? true : filter === 'unresolved' ? !a.resolved : a.severity === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 500, margin: 0 }}>Alerts & Notifications</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '4px 0 0' }}>{alerts.filter(a => !a.resolved).length} unresolved alerts</p>
        </div>
      </div>

      {/* Alert thresholds */}
      <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>ALERT THRESHOLDS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { label: 'Alert when churn rises above', value: '5%' },
            { label: 'Alert when payment fails', value: '3 retries' },
            { label: 'Alert when signup drops below', value: '5/week' },
          ].map(t => (
            <div key={t.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>{t.label}</div>
              <input defaultValue={t.value} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', fontSize: '16px', fontFamily: "'DM Mono', monospace", fontWeight: 500, width: '100%', outline: 'none' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#16161E', padding: '4px', borderRadius: '10px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        {['all', 'unresolved', 'high', 'medium', 'info'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", background: filter === f ? '#FF6B6B' : 'transparent', color: filter === f ? 'white' : 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((a, i) => (
          <div key={i} style={{ background: a.resolved ? '#16161E' : sevBg[a.severity], border: `1px solid ${a.resolved ? 'rgba(255,255,255,0.06)' : sevColor[a.severity] + '33'}`, borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', opacity: a.resolved ? 0.5 : 1 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sevColor[a.severity], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '12px', color: sevColor[a.severity], fontWeight: 500 }}>{a.type}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}>{a.time}</span>
                {a.resolved && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>Resolved</span>}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{a.msg}</div>
            </div>
            {!a.resolved && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '6px 12px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Take action</button>
                <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '7px', padding: '6px 12px', color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Dismiss</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
