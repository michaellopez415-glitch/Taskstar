'use client'

const plans = [
  { name: 'Free Trial', count: 48, revenue: '$0', color: '#6EC6F5' },
  { name: 'Pro Monthly', count: 187, revenue: '$1,861', color: '#6BCB77' },
  { name: 'Cancelled', count: 12, revenue: '$0', color: '#FF6B6B' },
]

const transactions = [
  { name: 'Sarah Johnson', amount: '$9.99', status: 'Paid', date: 'May 26', method: 'Visa ••4242' },
  { name: 'Mike Chen', amount: '$9.99', status: 'Paid', date: 'May 25', method: 'Mastercard ••8810' },
  { name: 'Lisa Wong', amount: '$9.99', status: 'Failed', date: 'May 25', method: 'Visa ••1234' },
  { name: 'David Park', amount: '$9.99', status: 'Paid', date: 'May 24', method: 'Amex ••3700' },
  { name: 'Anna Smith', amount: '$9.99', status: 'Refunded', date: 'May 22', method: 'Visa ••5678' },
]

const statusColor: Record<string, string> = { Paid: '#6BCB77', Failed: '#FF6B6B', Refunded: '#FFD93D' }

export default function AdminBilling() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 500, margin: 0 }}>Billing & Revenue</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '4px 0 0' }}>Stripe-connected · Live data</p>
      </div>

      {/* MRR Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'MRR', value: '$1,847', sub: '+$340 this month', up: true },
          { label: 'ARR', value: '$22,164', sub: 'Projected', up: true },
          { label: 'Churn Rate', value: '2.3%', sub: '-0.4% vs last month', up: false },
          { label: 'Avg LTV', value: '$84', sub: 'Per family', up: true },
        ].map(s => (
          <div key={s.label} style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 500, color: 'white', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: s.up ? '#6BCB77' : '#FF6B6B' }}>{s.up ? '↑' : '↓'} {s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Plan breakdown */}
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>PLAN BREAKDOWN</div>
          {plans.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{p.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: 'white', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{p.count} families</div>
                <div style={{ fontSize: '11px', color: p.color }}>{p.revenue}/mo</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '10px' }}>TRIAL CONVERSION RATE</div>
            <div style={{ fontSize: '28px', color: 'white', fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>79.6%</div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '79.6%', background: '#6BCB77', borderRadius: '99px' }} />
            </div>
          </div>
        </div>

        {/* Dunning & Alerts */}
        <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '16px' }}>PAYMENT HEALTH</div>
          {[
            { label: 'Payments succeeded', value: '94.2%', color: '#6BCB77' },
            { label: 'Payments failed', value: '5.8%', color: '#FF6B6B' },
            { label: 'Dunning retries pending', value: '3', color: '#FFD93D' },
            { label: 'Refunds this month', value: '2', color: '#9B72CF' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
              <span style={{ fontSize: '14px', color: r.color, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button style={{ flex: 1, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '8px', padding: '10px', color: '#FF6B6B', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Retry Failed Payments</button>
            <button style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Export CSV</button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>RECENT TRANSACTIONS</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{t.name}</td>
                <td style={{ padding: '12px 20px', fontSize: '13px', color: 'white', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{t.amount}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: `${statusColor[t.status]}22`, color: statusColor[t.status] }}>{t.status}</span>
                </td>
                <td style={{ padding: '12px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{t.date}</td>
                <td style={{ padding: '12px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{t.method}</td>
                <td style={{ padding: '12px 20px' }}>
                  <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 10px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
