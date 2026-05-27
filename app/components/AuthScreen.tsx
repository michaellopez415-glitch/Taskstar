'use client'
import { useState } from 'react'

interface AuthScreenProps {
  mode: string
  onNavigate: (screen: string, mode?: string) => void
  onAuth: (role: string, kidData?: any) => void
}

export default function AuthScreen({ mode, onNavigate, onAuth }: AuthScreenProps) {
  const [role, setRole] = useState('parent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [kidName, setKidName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isSignup = mode === 'signup'

  const handleParentSubmit = async () => {
    setError(''); setSuccess('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (isSignup && !name) { setError('Please enter your name.'); return }
    if (isSignup && password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)

    if (isSignup) {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name, role: 'parent' }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Signup failed.'); setLoading(false); return }
      setSuccess('✅ Account created! Check your email to verify, then log in.')
      setLoading(false)
    } else {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed. Check your email and password.'); setLoading(false); return }
      setLoading(false)
      onAuth('parent')
    }
  }

  const handleKidLogin = async () => {
    setError(''); setSuccess('')
    const pinStr = pin.join('')
    if (!kidName) { setError('Please enter your name!'); return }
    if (pinStr.length !== 4) { setError('Please enter your 4-digit PIN!'); return }
    setLoading(true)

    const res = await fetch('/api/kids/pin', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: kidName, pin: pinStr }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Login failed.'); setLoading(false); return }
    setLoading(false)
    onAuth('kid', data.kid)
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Please enter your email address first.'); return }
    setLoading(true)
    await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    setLoading(false)
    setSuccess('✅ Password reset email sent! Check your inbox.')
  }

  const handlePinInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const newPin = [...pin]
    newPin[idx] = val.slice(-1)
    setPin(newPin)
    if (val && idx < 3) {
      const next = document.getElementById(`pin-${idx+1}`)
      next?.focus()
    }
  }

  const handlePinKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      document.getElementById(`pin-${idx-1}`)?.focus()
    }
    if (e.key === 'Enter') role === 'kid' ? handleKidLogin() : handleParentSubmit()
  }

  const s = { fontFamily: "'Nunito', sans-serif" }

  return (
    <div style={{ ...s, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(135deg, #E0F4FF 0%, #FFF9E6 50%, #FFE8F0 100%)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ background: 'white', borderRadius: '32px', padding: '44px 40px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(45,42,74,0.15)', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>⭐</div>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '2rem', color: '#2D2A4A', margin: '0 0 6px' }}>
          {role === 'kid' ? 'Kid Login! 🧒' : isSignup ? 'Create Account!' : 'Welcome Back!'}
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
          {role === 'kid' ? 'Enter your name and PIN' : isSignup ? 'Start your free trial' : 'Log in to your family account'}
        </p>

        {/* Role Toggle */}
        <div style={{ display: 'flex', background: '#F0F0F0', borderRadius: '50px', padding: '4px', marginBottom: '24px' }}>
          {[['parent','👨‍👩‍👧 Parent'],['kid','🧒 Child']].map(([r, label]) => (
            <button key={r} onClick={() => { setRole(r); setError(''); setSuccess('') }}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '50px', fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', background: role === r ? '#2D2A4A' : 'transparent', color: role === r ? 'white' : '#888' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && <div style={{ background: '#FFF0F0', color: '#CC0000', border: '1px solid #FF6B6B', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textAlign: 'left' }}>{error}</div>}
        {success && <div style={{ background: '#F0FFF4', color: '#2D7A2D', border: '1px solid #6BCB77', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textAlign: 'left' }}>{success}</div>}

        {/* KID LOGIN */}
        {role === 'kid' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', color: '#2D2A4A', marginBottom: '6px' }}>Your Name</label>
              <input value={kidName} onChange={e => setKidName(e.target.value)} placeholder="e.g. Nico"
                style={{ width: '100%', padding: '13px 16px', border: '2.5px solid #E8E8E8', borderRadius: '14px', fontFamily: "'Nunito', sans-serif", fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6EC6F5'}
                onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', color: '#2D2A4A', marginBottom: '10px' }}>Your 4-Digit PIN</label>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {pin.map((digit, idx) => (
                  <input key={idx} id={`pin-${idx}`} type="password" maxLength={1} value={digit}
                    onChange={e => handlePinInput(idx, e.target.value)}
                    onKeyDown={e => handlePinKeyDown(idx, e)}
                    style={{ width: '60px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 900, border: '2.5px solid #E8E8E8', borderRadius: '16px', outline: 'none', fontFamily: "'Nunito', sans-serif", background: digit ? '#FFF9C4' : 'white', transition: 'all 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B6B'}
                    onBlur={e => e.target.style.borderColor = digit ? '#FF6B6B' : '#E8E8E8'} />
                ))}
              </div>
            </div>
            <button onClick={handleKidLogin} disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#ccc' : '#FF6B6B', border: 'none', borderRadius: '50px', fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.05rem', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(255,107,107,0.4)' }}>
              {loading ? '⏳ Checking...' : '🚀 Let\'s Go!'}
            </button>
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#bbb', fontWeight: 600, textAlign: 'center' }}>Ask your parent for your PIN if you don&apos;t know it!</p>
          </div>
        )}

        {/* PARENT LOGIN / SIGNUP */}
        {role === 'parent' && (
          <div style={{ textAlign: 'left' }}>
            {isSignup && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', color: '#2D2A4A', marginBottom: '6px' }}>Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Sarah Johnson" type="text"
                  style={{ width: '100%', padding: '13px 16px', border: '2.5px solid #E8E8E8', borderRadius: '14px', fontFamily: "'Nunito', sans-serif", fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6EC6F5'} onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', color: '#2D2A4A', marginBottom: '6px' }}>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
                style={{ width: '100%', padding: '13px 16px', border: '2.5px solid #E8E8E8', borderRadius: '14px', fontFamily: "'Nunito', sans-serif", fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6EC6F5'} onBlur={e => e.target.style.borderColor = '#E8E8E8'} />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', color: '#2D2A4A', marginBottom: '6px' }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password"
                style={{ width: '100%', padding: '13px 16px', border: '2.5px solid #E8E8E8', borderRadius: '14px', fontFamily: "'Nunito', sans-serif", fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6EC6F5'} onBlur={e => e.target.style.borderColor = '#E8E8E8'}
                onKeyDown={e => e.key === 'Enter' && !isSignup && handleParentSubmit()} />
            </div>
            {!isSignup && (
              <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                <button onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#FF6B6B', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Forgot password?</button>
              </div>
            )}
            {isSignup && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', color: '#2D2A4A', marginBottom: '6px' }}>Confirm Password</label>
                <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" type="password"
                  style={{ width: '100%', padding: '13px 16px', border: '2.5px solid #E8E8E8', borderRadius: '14px', fontFamily: "'Nunito', sans-serif", fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6EC6F5'} onBlur={e => e.target.style.borderColor = '#E8E8E8'}
                  onKeyDown={e => e.key === 'Enter' && handleParentSubmit()} />
              </div>
            )}
            <button onClick={handleParentSubmit} disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#ccc' : '#FF6B6B', border: 'none', borderRadius: '50px', fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1.05rem', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(255,107,107,0.4)', marginTop: '8px' }}>
              {loading ? '⏳ Please wait...' : isSignup ? '🚀 Create Free Account' : '→ Log In'}
            </button>
            <p style={{ marginTop: '12px', fontSize: '13px', color: '#aaa', fontWeight: 600, textAlign: 'center' }}>
              {isSignup ? <>Already have an account? <button onClick={() => onNavigate('auth', 'login')} style={{ background: 'none', border: 'none', color: '#FF6B6B', fontFamily: "'Nunito', sans-serif", fontWeight: 800, cursor: 'pointer' }}>Log in</button></> :
                <>Don&apos;t have an account? <button onClick={() => onNavigate('auth', 'signup')} style={{ background: 'none', border: 'none', color: '#FF6B6B', fontFamily: "'Nunito', sans-serif", fontWeight: 800, cursor: 'pointer' }}>Sign up free</button></>}
            </p>
          </div>
        )}

        <button onClick={() => onNavigate('landing')} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#ccc', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>← Back to home</button>
      </div>
    </div>
  )
}
