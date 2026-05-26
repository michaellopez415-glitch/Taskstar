'use client'
import { useState } from 'react'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) { alert(error); setLoading(false); return }
      window.location.href = url
    } catch { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#E0F4FF 0%,#FFF9E6 50%,#FFE8F0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '2rem', color: '#2D2A4A', marginBottom: '8px' }}>
          Task<span style={{ color: '#FF6B6B' }}>Star</span> ⭐
        </div>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 'clamp(2rem,5vw,3rem)', color: '#2D2A4A', margin: '0 0 12px' }}>
          Simple, family-friendly pricing
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', fontWeight: 600 }}>Try free for 7 days — no credit card required to start</p>
      </div>

      {/* Pricing Card */}
      <div style={{ background: 'white', borderRadius: '32px', padding: '40px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(45,42,74,0.15)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#FF6B6B', color: 'white', fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px' }}>MOST POPULAR</div>

        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#888', marginBottom: '8px' }}>FAMILY PLAN</div>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '4rem', color: '#2D2A4A', lineHeight: 1 }}>$4.99</div>
        <div style={{ color: '#aaa', fontWeight: 700, marginBottom: '24px' }}>per month · cancel anytime</div>

        <div style={{ background: '#FFF9C4', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', fontSize: '14px', fontWeight: 800, color: '#7a6200' }}>
          🎉 Start with a FREE 7-day trial — no card needed!
        </div>

        {/* Features */}
        <div style={{ textAlign: 'left', marginBottom: '28px' }}>
          {[
            'Up to 5 kids per family',
            'Unlimited daily, weekly & monthly tasks',
            'Prize goals with progress tracking',
            'Daily & weekly email reports',
            'Celebration animations & badges',
            'Parent approval controls',
            'Monthly scorecards',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '14px', fontWeight: 700, color: '#444' }}>
              <span style={{ color: '#6BCB77', fontSize: '16px' }}>✓</span> {f}
            </div>
          ))}
        </div>

        <button onClick={handleSubscribe} disabled={loading}
          style={{ width: '100%', padding: '16px', background: loading ? '#ccc' : '#FF6B6B', border: 'none', borderRadius: '16px', color: 'white', fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(255,107,107,0.4)', transition: 'all 0.2s' }}>
          {loading ? 'Loading...' : '🚀 Start Free 7-Day Trial'}
        </button>
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#bbb', fontWeight: 600 }}>No credit card required · Cancel anytime</p>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '420px', width: '100%', marginTop: '40px' }}>
        {[
          { q: 'What happens after the trial?', a: 'After 7 days you\'ll be asked to add a payment method. If you don\'t, your account pauses — no surprise charges.' },
          { q: 'Can I cancel anytime?', a: 'Yes! Cancel with one click from your account settings. No questions asked.' },
          { q: 'How many kids can I add?', a: 'Up to 5 kids per family account on the Family Plan.' },
        ].map(f => (
          <div key={f.q} style={{ background: 'white', borderRadius: '16px', padding: '16px 20px', marginBottom: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#2D2A4A', marginBottom: '6px' }}>{f.q}</div>
            <div style={{ fontSize: '13px', color: '#888', fontWeight: 600, lineHeight: 1.5 }}>{f.a}</div>
          </div>
        ))}
      </div>

      <button onClick={() => window.location.href = '/'} style={{ marginTop: '24px', background: 'transparent', border: 'none', color: '#aaa', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}>
        ← Back to home
      </button>
    </div>
  )
}
