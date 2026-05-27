'use client'
import { useState } from 'react'

interface AuthScreenProps {
  mode: string
  onNavigate: (screen: string, mode?: string) => void
  onAuth: (role: string) => void
}

export default function AuthScreen({ mode, onNavigate, onAuth }: AuthScreenProps) {
  const [role, setRole] = useState('parent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isSignup = mode === 'signup'

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (isSignup && !name) { setError('Please enter your name.'); return }
    if (isSignup && password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)

    if (isSignup) {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Signup failed. Please try again.'); setLoading(false); return }
      setSuccess('✅ Account created! Please check your email to verify your account, then log in.')
      setLoading(false)
    } else {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed. Check your email and password.'); setLoading(false); return }
      setLoading(false)
      onAuth(data.profile?.role || role)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Please enter your email address first.'); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSuccess('✅ Password reset email sent! Check your inbox.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: 'linear-gradient(135deg, #667eea22, #764ba222)', fontFamily: "'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div className="bg-white rounded-3xl p-11 w-full max-w-md text-center"
        style={{ boxShadow: '0 20px 60px rgba(45,42,74,0.15)' }}>
        <div className="text-6xl mb-3">⭐</div>
        <h2 className="font-fredoka text-3xl mb-1" style={{ color: '#2D2A4A', fontFamily: "'Fredoka One', cursive" }}>
          {isSignup ? 'Create Account!' : 'Welcome Back!'}
        </h2>
        <p className="text-gray-400 font-semibold text-sm mb-7">
          {isSignup ? 'Start your free 14-day trial' : 'Log in to your family account'}
        </p>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          {['parent', 'kid'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className="flex-1 py-2.5 rounded-full font-extrabold text-sm transition-all"
              style={{ background: role === r ? '#2D2A4A' : 'transparent', color: role === r ? 'white' : '#888' }}>
              {r === 'parent' ? '👨‍👩‍👧 Parent' : '🧒 Child'}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-left" style={{ background: '#FFF0F0', color: '#CC0000', border: '1px solid #FF6B6B' }}>{error}</div>}
        {success && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-left" style={{ background: '#F0FFF4', color: '#2D7A2D', border: '1px solid #6BCB77' }}>{success}</div>}

        {/* Form */}
        <div className="space-y-4 text-left">
          {isSignup && (
            <div>
              <label className="block font-extrabold text-xs mb-1.5" style={{ color: '#2D2A4A' }}>Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Sarah Johnson"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif" }}
                onFocus={e => e.target.style.borderColor = '#6EC6F5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
          )}
          <div>
            <label className="block font-extrabold text-xs mb-1.5" style={{ color: '#2D2A4A' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none transition-colors"
              style={{ fontFamily: "'Nunito', sans-serif" }}
              onFocus={e => e.target.style.borderColor = '#6EC6F5'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div>
            <label className="block font-extrabold text-xs mb-1.5" style={{ color: '#2D2A4A' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none transition-colors"
              style={{ fontFamily: "'Nunito', sans-serif" }}
              onFocus={e => e.target.style.borderColor = '#6EC6F5'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          {isSignup && (
            <div>
              <label className="block font-extrabold text-xs mb-1.5" style={{ color: '#2D2A4A' }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif" }}
                onFocus={e => e.target.style.borderColor = '#6EC6F5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          )}
        </div>

        {!isSignup && (
          <button onClick={handleForgotPassword} className="mt-2 text-xs font-bold text-right w-full" style={{ color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right' }}>
            Forgot password?
          </button>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-full font-black text-base text-white mt-4 transition-all"
          style={{ background: loading ? '#ccc' : '#FF6B6B', boxShadow: '0 4px 15px rgba(255,107,107,0.4)', fontFamily: "'Nunito', sans-serif", cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '⏳ Please wait...' : isSignup ? '🚀 Create Free Account' : '→ Log In'}
        </button>

        <p className="text-sm text-gray-400 font-semibold mt-3">
          {isSignup ? (
            <>Already have an account?{' '}
              <button onClick={() => onNavigate('auth', 'login')} className="font-extrabold" style={{ color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer' }}>Log in</button>
            </>
          ) : (
            <>Don&apos;t have an account?{' '}
              <button onClick={() => onNavigate('auth', 'signup')} className="font-extrabold" style={{ color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer' }}>Sign up free</button>
            </>
          )}
        </p>
        <button onClick={() => onNavigate('landing')} className="text-xs text-gray-300 mt-4 block hover:text-gray-500 transition-colors font-bold w-full" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}
