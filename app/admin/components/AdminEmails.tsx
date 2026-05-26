'use client'
import { useState } from 'react'

const emails = [
  { to: 'sarah.j@gmail.com', subject: '⭐ Daily Report — Tuesday, May 26', status: 'Delivered', opened: true, time: '8:00 AM' },
  { to: 'mike.chen@outlook.com', subject: '⭐ Daily Report — Tuesday, May 26', status: 'Delivered', opened: false, time: '8:00 AM' },
  { to: 'david.park@gmail.com', subject: '📊 Weekly Scorecard — 94% completion!', status: 'Delivered', opened: true, time: 'Mon 8:00 AM' },
  { to: 'anna.smith@yahoo.com', subject: '⏰ Your trial expires in 2 days', status: 'Bounced', opened: false, time: 'Sun 9:00 AM' },
  { to: 'lisa.wong@gmail.com', subject: '💳 Payment failed — action needed', status: 'Delivered', opened: true, time: 'Sat 2:15 PM' },
]

const templates = ['Daily Report', 'Weekly Scorecard', 'Trial Expiring', 'Payment Failed', 'Welcome Email', 'Prize Achieved']

export default function AdminEmails() {
  const [tab, setTab] = useState('sent')

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 500, margin: 0 }}>Email Control Center</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '4px 0 0' }}>Powered by Resend</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Sent Today', value: '247', color: '#6EC6F5' },
          { label: 'Open Rate', value: '68%', color: '#6BCB77' },
          { label: 'Bounce Rate', value: '1.2%', color: '#FF6B6B' },
          { label: 'Unsubscribes', value: '3', color: '#FFD93D' },
        ].map(s => (
          <div key={s.label} style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 500, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#16161E', padding: '4px', borderRadius: '10px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        {['sent', 'templates', 'broadcast'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", background: tab === t ? '#FF6B6B' : 'transparent', color: tab === t ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: tab === t ? 500 : 400, textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab === 'sent' && (
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Recipient', 'Subject', 'Status', 'Opened', 'Time'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', fontWeight: 400 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emails.map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Mono', monospace" }}>{e.to}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{e.subject}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: e.status === 'Delivered' ? 'rgba(107,203,119,0.1)' : 'rgba(255,107,107,0.1)', color: e.status === 'Delivered' ? '#6BCB77' : '#FF6B6B' }}>{e.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: e.opened ? '#6BCB77' : 'rgba(255,255,255,0.2)' }}>{e.opened ? '✓ Opened' : 'Not opened'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{e.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {templates.map(t => (
            <div key={t} style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'white', fontWeight: 500, marginBottom: '8px' }}>{t}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>Auto-sends based on trigger</div>
              <button style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '7px', padding: '7px 14px', color: '#FF6B6B', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✏️ Edit Template</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'broadcast' && (
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', maxWidth: '560px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>SEND ANNOUNCEMENT</div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Audience</label>
            <select style={{ width: '100%', background: '#0F0F14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: "'DM Sans', sans-serif" }}>
              <option>All Users (247)</option>
              <option>Pro subscribers only (187)</option>
              <option>Trial users only (48)</option>
              <option>Parents only</option>
            </select>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Subject</label>
            <input placeholder="e.g. New feature: Monthly Reports are here!" style={{ width: '100%', background: '#0F0F14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Message</label>
            <textarea rows={4} placeholder="Write your announcement..." style={{ width: '100%', background: '#0F0F14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button style={{ background: '#FF6B6B', border: 'none', borderRadius: '8px', padding: '12px 24px', color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>Send Announcement →</button>
        </div>
      )}
    </div>
  )
}
