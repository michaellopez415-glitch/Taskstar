'use client'

const logs = [
  { time: '11:34 AM', action: 'Admin login', user: 'michaellopez415', ip: '192.168.1.1', status: 'Success' },
  { time: '9:12 AM', action: 'User suspended', user: 'michaellopez415', ip: '192.168.1.1', status: 'Success' },
  { time: 'Yesterday', action: 'Password reset sent', user: 'michaellopez415', ip: '192.168.1.1', status: 'Success' },
  { time: 'Yesterday', action: 'Failed login attempt', user: 'unknown', ip: '203.45.67.89', status: 'Blocked' },
  { time: 'May 24', action: 'Bulk email sent', user: 'michaellopez415', ip: '192.168.1.1', status: 'Success' },
  { time: 'May 24', action: 'Failed login attempt', user: 'unknown', ip: '91.120.45.2', status: 'Blocked' },
]

export default function AdminSecurity() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 500, margin: 0 }}>Security & Audit Logs</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '4px 0 0' }}>All admin actions are logged</p>
      </div>

      {/* Security Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Login Attempts', value: '2 blocked', color: '#FF6B6B' },
          { label: '2FA Status', value: 'Enabled', color: '#6BCB77' },
          { label: 'SSL Certificate', value: 'Valid', color: '#6BCB77' },
          { label: 'Data Encrypted', value: 'Yes (AES-256)', color: '#6BCB77' },
        ].map(s => (
          <div key={s.label} style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* COPPA Compliance */}
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>COPPA / GDPR COMPLIANCE</div>
          {[
            { label: 'Parental consent records', value: '247', ok: true },
            { label: 'Data deletion requests', value: '0 pending', ok: true },
            { label: 'Children data encrypted', value: 'Yes', ok: true },
            { label: 'Consent verification method', value: 'Email + checkbox', ok: true },
            { label: 'Last compliance audit', value: 'May 2026', ok: true },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{r.label}</span>
              <span style={{ fontSize: '12px', color: r.ok ? '#6BCB77' : '#FF6B6B', fontFamily: "'DM Mono', monospace" }}>{r.value}</span>
            </div>
          ))}
          <button style={{ background: 'rgba(107,203,119,0.1)', border: '1px solid rgba(107,203,119,0.2)', borderRadius: '8px', padding: '10px 16px', color: '#6BCB77', fontSize: '12px', cursor: 'pointer', marginTop: '8px', fontFamily: "'DM Sans', sans-serif" }}>Download Compliance Report</button>
        </div>

        {/* Role Access */}
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>ADMIN ACCESS CONTROL</div>
          {[
            { role: 'Super Admin', user: 'michaellopez415', access: 'Full access' },
          ].map(r => (
            <div key={r.role} style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>{r.role}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace", marginTop: '2px' }}>{r.user}</div>
                </div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: 'rgba(255,107,107,0.1)', color: '#FF6B6B' }}>{r.access}</span>
              </div>
            </div>
          ))}
          <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%', marginTop: '8px' }}>+ Invite Team Member</button>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '10px' }}>SECURITY SETTINGS</div>
            {['Require 2FA for admin login', 'Alert on suspicious IP', 'Auto-lock after 5 failed logins'].map(s => (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{s}</span>
                <div style={{ width: '32px', height: '18px', background: '#6BCB77', borderRadius: '99px', position: 'relative' }}>
                  <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>AUDIT LOG</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace", width: '100px' }}>{l.time}</td>
                <td style={{ padding: '12px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{l.action}</td>
                <td style={{ padding: '12px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{l.user}</td>
                <td style={{ padding: '12px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}>{l.ip}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: l.status === 'Success' ? 'rgba(107,203,119,0.1)' : 'rgba(255,107,107,0.1)', color: l.status === 'Success' ? '#6BCB77' : '#FF6B6B' }}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
