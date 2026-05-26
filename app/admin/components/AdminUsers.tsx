'use client'
import { useState } from 'react'

const users = [
  { name: 'Sarah Johnson', email: 'sarah.j@gmail.com', role: 'Parent', kids: 3, plan: 'Pro', status: 'Active', joined: 'Jan 12', stars: 847 },
  { name: 'Mike Chen', email: 'mike.chen@outlook.com', role: 'Parent', kids: 2, plan: 'Pro', status: 'Active', joined: 'Feb 3', stars: 1204 },
  { name: 'Anna Smith', email: 'anna.smith@yahoo.com', role: 'Parent', kids: 1, plan: 'Trial', status: 'Expired', joined: 'May 10', stars: 23 },
  { name: 'David Park', email: 'david.park@gmail.com', role: 'Parent', kids: 4, plan: 'Pro', status: 'Active', joined: 'Mar 22', stars: 2341 },
  { name: 'Lisa Wong', email: 'lisa.wong@gmail.com', role: 'Parent', kids: 2, plan: 'Pro', status: 'Past Due', joined: 'Apr 8', stars: 512 },
  { name: 'Emma Johnson', email: '—', role: 'Child', kids: 0, plan: '—', status: 'Active', joined: 'Jan 12', stars: 847 },
  { name: 'Jake Chen', email: '—', role: 'Child', kids: 0, plan: '—', status: 'Active', joined: 'Feb 3', stars: 412 },
]

const statusColor: Record<string, string> = { Active: '#6BCB77', Expired: '#FF6B6B', 'Past Due': '#FFD93D' }

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 500, margin: 0 }}>User Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '4px 0 0' }}>{users.length} total accounts</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 14px', color: 'white', fontSize: '13px', outline: 'none', width: '220px', fontFamily: "'DM Sans', sans-serif" }} />
          <button style={{ background: '#FF6B6B', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ Add User</button>
        </div>
      </div>

      <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name', 'Role', 'Kids', 'Plan', 'Status', 'Joined', 'Stars', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', fontWeight: 400 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i} onClick={() => setSelected(selected === i ? null : i)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selected === i ? 'rgba(255,107,107,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{u.email}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: u.role === 'Parent' ? 'rgba(155,114,207,0.15)' : 'rgba(110,198,245,0.15)', color: u.role === 'Parent' ? '#9B72CF' : '#6EC6F5' }}>{u.role}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Mono', monospace" }}>{u.kids || '—'}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{u.plan}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: statusColor[u.status] || 'gray' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColor[u.status] || 'gray' }} />{u.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{u.joined}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#FFD93D', fontFamily: "'DM Mono', monospace" }}>⭐ {u.stars}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['View', 'Reset PW', 'Suspend'].map(a => (
                      <button key={a} onClick={e => e.stopPropagation()} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 8px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{a}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected !== null && (
        <div style={{ marginTop: '16px', background: '#16161E', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '12px' }}>SELECTED USER — {filtered[selected]?.name.toUpperCase()}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {['Impersonate User', 'Send Email', 'Extend Trial', 'Delete Account'].map((a, i) => (
              <button key={a} style={{ background: i === 3 ? 'rgba(255,107,107,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 3 ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '10px', color: i === 3 ? '#FF6B6B' : 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{a}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
