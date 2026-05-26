'use client'
import { useState, useEffect } from 'react'

interface LandingPageProps {
  onNavigate: (screen: string, mode?: string) => void
}

const features = [
  { icon: '✅', title: 'Daily & Weekly Tasks', desc: 'Set custom tasks per child — daily, weekly, or monthly. Your rules!' },
  { icon: '🏆', title: 'Prize Goals', desc: 'Set a prize for each child. They earn stars and watch the countdown!' },
  { icon: '📧', title: 'Parent Reports', desc: 'Daily & weekly email summaries so you always know what\'s happening.' },
  { icon: '🎉', title: 'Celebration Moments', desc: 'Animated characters cheer every time a task is completed!' },
  { icon: '🔒', title: 'Parent Approval', desc: 'You control whether kids self-check or need your approval first.' },
  { icon: '📊', title: 'Weekly Scorecards', desc: 'End-of-week and monthly reports showing completions and streaks.' },
]

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number; dur: number }[]>([])

  useEffect(() => {
    setStars(Array.from({ length: 18 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 90,
      size: Math.random() * 12 + 5,
      delay: Math.random() * 2,
      dur: 1.5 + Math.random() * 2,
    })))
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #E0F4FF 0%, #FFF9E6 50%, #FFE8F0 100%)' }}>
      {/* Stars background */}
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full animate-twinkle pointer-events-none" style={{
          width: s.size, height: s.size,
          left: `${s.x}%`, top: `${s.y}%`,
          background: 'var(--sun)', opacity: 0.5,
          animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`,
        }} />
      ))}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5">
        <div className="font-fredoka text-3xl" style={{ color: 'var(--dark)' }}>
          Task<span style={{ color: 'var(--coral)' }}>Star</span> ⭐
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate('auth', 'login')}
            className="px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all hover:bg-gray-900 hover:text-white"
            style={{ borderColor: 'var(--dark)', color: 'var(--dark)' }}>
            Log In
          </button>
          <button onClick={() => onNavigate('auth', 'signup')}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--coral)', boxShadow: '0 4px 15px rgba(255,107,107,0.4)' }}>
            Try Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 text-center px-5 pt-12 pb-10">
        <div className="text-8xl block animate-float mb-4">🦸</div>
        <h1 className="font-fredoka mb-4" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1.1, color: 'var(--dark)' }}>
          Make chores <span style={{ color: 'var(--coral)' }}>fun</span> &<br />
          kids <span style={{ color: 'var(--coral)' }}>accountable!</span>
        </h1>
        <p className="text-lg font-semibold text-gray-500 max-w-xl mx-auto mb-8" style={{ lineHeight: 1.6 }}>
          Daily, weekly & monthly tasks for your kids — with rewards, celebrations, and parent updates built right in.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => onNavigate('auth', 'signup')}
            className="px-9 py-4 rounded-full font-black text-lg text-white transition-all hover:-translate-y-1"
            style={{ background: 'var(--coral)', boxShadow: '0 6px 20px rgba(255,107,107,0.4)' }}>
            🚀 Start Free Trial
          </button>
          <button onClick={() => onNavigate('parent-dash')}
            className="px-9 py-4 rounded-full font-black text-lg text-white transition-all hover:-translate-y-1"
            style={{ background: 'var(--dark)', boxShadow: '0 6px 20px rgba(45,42,74,0.3)' }}>
            👀 See Demo
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 grid gap-5 px-10 pb-16 max-w-5xl mx-auto"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-3xl p-7 text-center transition-all hover:-translate-y-1"
            style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.13)' }}>
            <div className="text-5xl mb-3">{f.icon}</div>
            <h3 className="font-fredoka text-xl mb-2" style={{ color: 'var(--dark)' }}>{f.title}</h3>
            <p className="text-sm font-semibold text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
