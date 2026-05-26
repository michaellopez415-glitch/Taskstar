'use client'
import { useState } from 'react'

interface AuthScreenProps {
  mode: string
  onNavigate: (screen: string, mode?: string) => void
  onAuth: (role: string) => void
}

export default function AuthScreen({ mode, onNavigate, onAuth }: AuthScreenProps) {
  const [role, setRole] = useState('parent')
  const isSignup = mode === 'signup'

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: 'linear-gradient(135deg, #667eea22, #764ba222)' }}>
      <div className="bg-white rounded-3xl p-11 w-full max-w-md text-center"
        style={{ boxShadow: '0 20px 60px rgba(45,42,74,0.15)' }}>
        <div className="text-6xl mb-3">⭐</div>
        <h2 className="font-fredoka text-3xl mb-1" style={{ color: 'var(--dark)' }}>
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
              style={{ background: role === r ? 'var(--dark)' : 'transparent', color: role === r ? 'white' : '#888' }}>
              {r === 'parent' ? '👨‍👩‍👧 Parent' : '🧒 Child'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4 text-left">
          {isSignup && (
            <div>
              <label className="block font-extrabold text-xs mb-1.5" style={{ color: 'var(--dark)' }}>Your Name</label>
              <input type="text" placeholder="E.g. Sarah Johnson"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
            </div>
          )}
          <div>
            <label className="block font-extrabold text-xs mb-1.5" style={{ color: 'var(--dark)' }}>Email Address</label>
            <input type="email" placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
          </div>
          <div>
            <label className="block font-extrabold text-xs mb-1.5" style={{ color: 'var(--dark)' }}>Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
          </div>
          {isSignup && (
            <div>
              <label className="block font-extrabold text-xs mb-1.5" style={{ color: 'var(--dark)' }}>Confirm Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
            </div>
          )}
        </div>

        <button onClick={() => onAuth(role)}
          className="w-full py-4 rounded-full font-black text-base text-white mt-5 transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--coral)', boxShadow: '0 4px 15px rgba(255,107,107,0.4)' }}>
          {isSignup ? '🚀 Create Free Account' : '→ Log In'}
        </button>

        <p className="text-sm text-gray-400 font-semibold mt-3">
          {isSignup ? (
            <>Already have an account?{' '}
              <button onClick={() => onNavigate('auth', 'login')} className="font-extrabold" style={{ color: 'var(--coral)' }}>Log in</button>
            </>
          ) : (
            <>Don&apos;t have an account?{' '}
              <button onClick={() => onNavigate('auth', 'signup')} className="font-extrabold" style={{ color: 'var(--coral)' }}>Sign up free</button>
            </>
          )}
        </p>
        <button onClick={() => onNavigate('landing')} className="text-xs text-gray-300 mt-4 block hover:text-gray-500 transition-colors font-bold">
          ← Back to home
        </button>
      </div>
    </div>
  )
}
