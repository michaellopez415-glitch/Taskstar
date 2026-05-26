'use client'

const nav = [
  { id: 'overview', icon: '◈', label: 'Overview' },
  { id: 'users', icon: '◉', label: 'Users' },
  { id: 'billing', icon: '◆', label: 'Billing' },
  { id: 'emails', icon: '◎', label: 'Emails' },
  { id: 'security', icon: '◐', label: 'Security' },
  { id: 'alerts', icon: '◑', label: 'Alerts' },
]

export default function AdminSidebar({ active, onNavigate }: { active: string; onNavigate: (s: string) => void }) {
  return (
    <aside style={{
      width: '220px', background: '#0A0A0F', borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '28px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh'
    }}>
      <div style={{ padding: '0 24px 32px' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#FF6B6B', letterSpacing: '0.15em', fontWeight: 500 }}>TASK★STAR</div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', letterSpacing: '0.1em' }}>ADMIN CONTROL</div>
      </div>

      <nav style={{ flex: 1 }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 24px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: active === item.id ? 'rgba(255,107,107,0.08)' : 'transparent',
              borderLeft: active === item.id ? '2px solid #FF6B6B' : '2px solid transparent',
              color: active === item.id ? '#FF6B6B' : 'rgba(255,255,255,0.4)',
              fontSize: '13px', fontWeight: active === item.id ? 500 : 400,
              transition: 'all 0.15s', letterSpacing: '0.02em',
            }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
          Logged in as<br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>michaellopez415</span>
        </div>
      </div>
    </aside>
  )
}
