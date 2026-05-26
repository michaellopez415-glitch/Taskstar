'use client'
import { useState, useCallback } from 'react'

interface Task { label: string; freq: string; icon: string; stars: number; done: boolean }

const initialTasks: Task[] = [
  { label: 'Make your bed', freq: 'Daily · Morning', icon: '🛏️', stars: 5, done: true },
  { label: 'Do your homework', freq: 'Daily · Afternoon', icon: '📚', stars: 10, done: true },
  { label: 'Brush teeth', freq: 'Daily · Morning & Evening', icon: '🦷', stars: 3, done: true },
  { label: 'Clean your room', freq: 'Daily · Before dinner', icon: '🧹', stars: 8, done: false },
  { label: 'Read for 20 minutes', freq: 'Daily · Bedtime', icon: '📖', stars: 7, done: false },
  { label: 'Help with laundry', freq: 'Weekly · Any day', icon: '🧺', stars: 15, done: false },
  { label: 'Water the plants', freq: 'Weekly · Saturday', icon: '🌿', stars: 10, done: false },
]

const mascots = ['🦸','🦄','🦁','🐯','🚀','⭐','🌟','🎯']
const msgs = [
  'Complete your tasks to get closer to your prize! 🎮',
  "You're doing amazing! Keep it up! 🌟",
  'Almost there! Your prize is waiting! 🏆',
  'Woah, look at you go! Super star! ⭐',
  'Every task brings you closer to your dream! 🚀',
]
const celebrations = [
  { emoji: '🎉', title: 'Amazing!', msg: 'You completed a task! Keep going!' },
  { emoji: '🌟', title: 'Super Star!', msg: "You're on fire! Prize getting closer!" },
  { emoji: '🦸', title: 'Hero Move!', msg: "That's what superheroes do!" },
  { emoji: '🏆', title: 'Champion!', msg: "You're crushing it today!" },
  { emoji: '🚀', title: 'Blast Off!', msg: 'One task closer to your prize!' },
]

interface Confetti { id: number; x: number; y: number; color: string; size: number; round: boolean; delay: number }

export default function KidDashboard({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [totalStars, setTotalStars] = useState(47)
  const [mascot, setMascot] = useState('🦸')
  const [speech, setSpeech] = useState(msgs[0])
  const [celebration, setCelebration] = useState<null | typeof celebrations[0]>(null)
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [prizeBasePct] = useState(68)
  const [bonusPct, setBonusPct] = useState(0)

  const launchConfetti = useCallback(() => {
    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#6EC6F5','#9B72CF','#FFB347']
    setConfetti(Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 6, round: Math.random() > 0.5, delay: Math.random() * 0.5,
    })))
    setTimeout(() => setConfetti([]), 2000)
  }, [])

  const toggleTask = (idx: number) => {
    const t = tasks[idx]
    if (!t.done) {
      const newTasks = tasks.map((task, i) => i === idx ? { ...task, done: true } : task)
      setTasks(newTasks)
      setTotalStars(s => s + t.stars)
      setBonusPct(p => Math.min(100 - prizeBasePct, p + 4))
      setMascot(mascots[Math.floor(Math.random() * mascots.length)])
      setSpeech(msgs[Math.floor(Math.random() * msgs.length)])
      setCelebration(celebrations[Math.floor(Math.random() * celebrations.length)])
      launchConfetti()
      setTimeout(() => setCelebration(null), 2800)
    } else {
      const newTasks = tasks.map((task, i) => i === idx ? { ...task, done: false } : task)
      setTasks(newTasks)
      setTotalStars(s => Math.max(0, s - t.stars))
      setBonusPct(p => Math.max(0, p - 4))
    }
  }

  const prizePct = Math.min(100, prizeBasePct + bonusPct)
  const daily = tasks.slice(0, 5)
  const weekly = tasks.slice(5)

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(160deg,#E8F4FD 0%,#FFF5E6 100%)' }}>
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {confetti.map(c => (
          <div key={c.id} className="absolute animate-confetti"
            style={{ left:`${c.x}%`, top:`${c.y}%`, width:c.size, height:c.size,
              background:c.color, borderRadius:c.round?'50%':'2px', animationDelay:`${c.delay}s` }} />
        ))}
      </div>

      {/* Overlay + Celebration */}
      {celebration && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setCelebration(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl p-10 text-center max-w-xs w-11/12 animate-bounce-in"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="text-8xl mb-2" style={{ animation: 'bounce 0.5s infinite alternate' }}>{celebration.emoji}</div>
            <h3 className="font-fredoka text-3xl mb-2" style={{ color: 'var(--dark)' }}>{celebration.title}</h3>
            <p className="text-gray-400 font-bold text-sm mb-5">{celebration.msg}</p>
            <button onClick={() => setCelebration(null)}
              className="px-8 py-3 rounded-full font-black text-white text-sm"
              style={{ background: 'var(--coral)' }}>
              Woohoo! 🚀
            </button>
          </div>
        </>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="font-fredoka text-2xl" style={{ color: 'var(--dark)' }}>
          Task<span style={{ color: 'var(--coral)' }}>Star</span> ⭐
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full font-fredoka text-lg"
          style={{ background: 'var(--sun)', color: '#7a6200' }}>
          ⭐ {totalStars} Stars
        </div>
      </div>

      {/* Name */}
      <div className="text-center px-5 pb-5">
        <div className="font-fredoka text-3xl" style={{ color: 'var(--dark)' }}>Hi, Emma! 👋</div>
        <div className="text-sm text-gray-400 font-bold mt-0.5">You&apos;re doing amazing today!</div>
      </div>

      {/* Mascot */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-8xl animate-float mb-2">{mascot}</div>
        <div className="bg-white rounded-2xl px-5 py-3 font-extrabold text-sm max-w-xs text-center relative"
          style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.13)', color: 'var(--dark)' }}>
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderBottom:'10px solid white' }} />
          {speech}
        </div>
      </div>

      {/* Prize Goal */}
      <div className="mx-5 mb-6 rounded-3xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg,#FFE082,#FFD93D)', boxShadow: '0 6px 24px rgba(255,200,0,0.3)' }}>
        <div className="text-5xl">🎮</div>
        <div className="flex-1">
          <h3 className="font-fredoka text-xl" style={{ color: '#5a4200' }}>Prize: New Game!</h3>
          <div className="h-3.5 rounded-full mt-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${prizePct}%` }} />
          </div>
          <div className="text-xs font-extrabold mt-1" style={{ color: '#7a5c00' }}>{prizePct}% complete · Keep going! 🔥</div>
        </div>
      </div>

      {/* Tasks */}
      <div className="px-5">
        <div className="font-fredoka text-xl mb-3 flex items-center gap-2" style={{ color: 'var(--dark)' }}>📅 Today&apos;s Tasks</div>
        {daily.map((t, i) => (
          <div key={i} onClick={() => toggleTask(i)}
            className="rounded-2xl p-4 mb-3 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: t.done ? 'linear-gradient(135deg,#F0FFF4,#E8FFF0)' : 'white',
              border: t.done ? '2px solid #6BCB77' : '2px solid transparent',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0 transition-all"
              style={{ background: t.done ? 'var(--mint)' : '#fafafa', border: `3px solid ${t.done ? 'var(--mint)' : '#ddd'}` }}>
              {t.done ? '✅' : t.icon}
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm" style={{ color: t.done ? '#aaa' : 'var(--dark)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.label}</div>
              <div className="text-xs text-gray-400 font-bold mt-0.5">{t.freq}</div>
            </div>
            <div className="px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: '#FFF9C4', color: '#7a6200' }}>⭐ +{t.stars}</div>
          </div>
        ))}

        <div className="font-fredoka text-xl mt-6 mb-3 flex items-center gap-2" style={{ color: 'var(--dark)' }}>📆 This Week</div>
        {weekly.map((t, i) => (
          <div key={i} onClick={() => toggleTask(i + 5)}
            className="rounded-2xl p-4 mb-3 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: t.done ? 'linear-gradient(135deg,#F0FFF4,#E8FFF0)' : 'white',
              border: t.done ? '2px solid #6BCB77' : '2px solid transparent',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: t.done ? 'var(--mint)' : '#fafafa', border: `3px solid ${t.done ? 'var(--mint)' : '#ddd'}` }}>
              {t.done ? '✅' : t.icon}
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm" style={{ color: t.done ? '#aaa' : 'var(--dark)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.label}</div>
              <div className="text-xs text-gray-400 font-bold mt-0.5">{t.freq}</div>
            </div>
            <div className="px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: '#FFF9C4', color: '#7a6200' }}>⭐ +{t.stars}</div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around px-6 pt-3 pb-5 z-30"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        {[['✅','Tasks',true],['⭐','My Stars',false],['🏅','Badges',false],['🏠','Home',false]].map(([icon, label, active]) => (
          <div key={label as string} onClick={() => label === 'Home' && onNavigate('landing')}
            className="flex flex-col items-center gap-1 cursor-pointer transition-colors"
            style={{ color: active ? 'var(--coral)' : '#bbb' }}>
            <div className="text-2xl">{icon}</div>
            <span className="text-xs font-extrabold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
