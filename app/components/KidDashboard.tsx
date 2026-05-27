'use client'
import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Task {
  id: string
  label: string
  freq: string
  icon: string
  stars: number
  done: boolean
  frequency: string
}

interface KidData {
  id: string
  name: string
  emoji: string
  prize_name: string
  prize_emoji: string
  prize_pct: number
  total_stars: number
  tasks: Task[]
}

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

// Demo data for when no real data is available
const demoKid: KidData = {
  id: 'demo',
  name: 'Emma',
  emoji: '🧒',
  prize_name: 'New Game',
  prize_emoji: '🎮',
  prize_pct: 68,
  total_stars: 47,
  tasks: [
    { id: '1', label: 'Make your bed', freq: 'Daily · Morning', icon: '🛏️', stars: 5, done: true, frequency: 'Daily' },
    { id: '2', label: 'Do your homework', freq: 'Daily · Afternoon', icon: '📚', stars: 10, done: true, frequency: 'Daily' },
    { id: '3', label: 'Brush teeth', freq: 'Daily · Morning & Evening', icon: '🦷', stars: 3, done: true, frequency: 'Daily' },
    { id: '4', label: 'Clean your room', freq: 'Daily · Before dinner', icon: '🧹', stars: 8, done: false, frequency: 'Daily' },
    { id: '5', label: 'Read for 20 minutes', freq: 'Daily · Bedtime', icon: '📖', stars: 7, done: false, frequency: 'Daily' },
    { id: '6', label: 'Help with laundry', freq: 'Weekly · Any day', icon: '🧺', stars: 15, done: false, frequency: 'Weekly' },
    { id: '7', label: 'Water the plants', freq: 'Weekly · Saturday', icon: '🌿', stars: 10, done: false, frequency: 'Weekly' },
  ]
}

export default function KidDashboard({ onNavigate, kidData }: { onNavigate: (s: string) => void; kidData?: any }) {
  const [kid, setKid] = useState<KidData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mascot, setMascot] = useState('🦸')
  const [speech, setSpeech] = useState(msgs[0])
  const [celebration, setCelebration] = useState<null | typeof celebrations[0]>(null)
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [isDemo, setIsDemo] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadKidData()
  }, [])

  const loadKidData = async () => {
    setLoading(true)

    // If kid data was passed from PIN login, use it
    if (kidData?.id) {
      const formattedTasks = (kidData.tasks || []).map((t: any) => ({
        id: t.id,
        label: t.label,
        freq: `${t.frequency}`,
        icon: t.icon || '✅',
        stars: t.stars || 5,
        done: t.done || false,
        frequency: t.frequency,
      }))
      setKid({
        id: kidData.id,
        name: kidData.name,
        emoji: kidData.emoji || '🧒',
        prize_name: kidData.prize_name || '',
        prize_emoji: kidData.prize_emoji || '🎁',
        prize_pct: kidData.prize_pct || 0,
        total_stars: kidData.total_stars || 0,
        tasks: formattedTasks,
      })
      setIsDemo(false)
      setLoading(false)
      return
    }

    // Otherwise show demo data
    setKid(demoKid)
    setIsDemo(true)
    setLoading(false)
  }

  const launchConfetti = useCallback(() => {
    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#6EC6F5','#9B72CF','#FFB347']
    setConfetti(Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 6, round: Math.random() > 0.5, delay: Math.random() * 0.5,
    })))
    setTimeout(() => setConfetti([]), 2000)
  }, [])

  const toggleTask = async (taskId: string) => {
    if (!kid) return
    const task = kid.tasks.find(t => t.id === taskId)
    if (!task) return

    const newDone = !task.done

    // Update locally first for instant feedback
    const updatedTasks = kid.tasks.map(t => t.id === taskId ? { ...t, done: newDone } : t)
    const starDelta = newDone ? task.stars : -task.stars
    const newStars = Math.max(0, kid.total_stars + starDelta)
    const newPct = Math.min(100, Math.max(0, kid.prize_pct + (newDone ? 4 : -4)))

    setKid({ ...kid, tasks: updatedTasks, total_stars: newStars, prize_pct: newPct })

    if (newDone) {
      setMascot(mascots[Math.floor(Math.random() * mascots.length)])
      setSpeech(msgs[Math.floor(Math.random() * msgs.length)])
      setCelebration(celebrations[Math.floor(Math.random() * celebrations.length)])
      launchConfetti()
      setTimeout(() => setCelebration(null), 2800)
    }

    // Save to database if not demo
    if (!isDemo && kid.id !== 'demo') {
      try {
        await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: taskId, done: newDone }),
        })
      } catch (e) {
        console.error('Failed to save task:', e)
      }
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#E8F4FD 0%,#FFF5E6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', animation: 'float 1s ease-in-out infinite' }}>⭐</div>
          <div style={{ fontWeight: 800, color: '#2D2A4A', marginTop: '16px' }}>Loading your tasks...</div>
        </div>
      </div>
    )
  }

  if (!kid) return null

  const daily = kid.tasks.filter(t => t.frequency === 'Daily')
  const weekly = kid.tasks.filter(t => t.frequency === 'Weekly')
  const monthly = kid.tasks.filter(t => t.frequency === 'Monthly')
  const doneTasks = kid.tasks.filter(t => t.done).length
  const totalTasks = kid.tasks.length

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', background: 'linear-gradient(160deg,#E8F4FD 0%,#FFF5E6 100%)', fontFamily: "'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        {confetti.map(c => (
          <div key={c.id} className="animate-confetti"
            style={{ position: 'absolute', left:`${c.x}%`, top:`${c.y}%`, width:c.size, height:c.size,
              background:c.color, borderRadius:c.round?'50%':'2px', animationDelay:`${c.delay}s` }} />
        ))}
      </div>

      {/* Celebration popup */}
      {celebration && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setCelebration(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 50, background: 'white', borderRadius: '32px', padding: '40px', textAlign: 'center', maxWidth: '300px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '8px' }}>{celebration.emoji}</div>
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: '#2D2A4A', margin: '0 0 8px' }}>{celebration.title}</h3>
            <p style={{ color: '#888', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>{celebration.msg}</p>
            <button onClick={() => setCelebration(null)}
              style={{ padding: '12px 28px', borderRadius: '50px', background: '#FF6B6B', border: 'none', color: 'white', fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: '1rem', cursor: 'pointer' }}>
              Woohoo! 🚀
            </button>
          </div>
        </>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', color: '#2D2A4A' }}>
          Task<span style={{ color: '#FF6B6B' }}>Star</span> ⭐
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#FFD93D', borderRadius: '50px', fontFamily: "'Fredoka One', cursive", fontSize: '1.1rem', color: '#7a6200' }}>
          ⭐ {kid.total_stars} Stars
        </div>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div style={{ margin: '0 20px 12px', background: '#FFF9C4', border: '1px solid #FFD93D', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: '#7a6200', textAlign: 'center' }}>
          👋 Demo mode — Log in with your PIN to see your real tasks!
        </div>
      )}

      {/* Name & subtitle */}
      <div style={{ textAlign: 'center', padding: '4px 20px 16px' }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '2rem', color: '#2D2A4A' }}>Hi, {kid.name}! 👋</div>
        <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 700 }}>
          {doneTasks}/{totalTasks} tasks done today — {doneTasks === totalTasks && totalTasks > 0 ? 'Amazing! 🏆' : "You're doing great! ⭐"}
        </div>
      </div>

      {/* Mascot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '6rem', animation: 'float 3s ease-in-out infinite', display: 'block', marginBottom: '8px' }}>{mascot}</div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '12px 20px', fontWeight: 800, fontSize: '0.95rem', maxWidth: '280px', textAlign: 'center', boxShadow: '0 8px 32px rgba(45,42,74,0.13)', color: '#2D2A4A', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid white' }} />
          {speech}
        </div>
      </div>

      {/* Prize Goal */}
      {kid.prize_name && (
        <div style={{ margin: '0 20px 20px', borderRadius: '24px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg,#FFE082,#FFD93D)', boxShadow: '0 6px 24px rgba(255,200,0,0.3)' }}>
          <div style={{ fontSize: '3rem' }}>{kid.prize_emoji}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.1rem', color: '#5a4200', margin: '0 0 4px' }}>Prize: {kid.prize_name}!</h3>
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '50px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'white', borderRadius: '50px', width: `${kid.prize_pct}%`, transition: 'width 1s ease' }} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#7a5c00', marginTop: '4px' }}>{kid.prize_pct}% complete · Keep going! 🔥</div>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div style={{ padding: '0 20px' }}>
        {kid.tasks.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.3rem', color: '#2D2A4A', marginBottom: '8px' }}>No tasks yet!</div>
            <div style={{ color: '#aaa', fontWeight: 600 }}>Ask your parent to add some tasks for you!</div>
          </div>
        ) : (
          <>
            {daily.length > 0 && (
              <>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem', color: '#2D2A4A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📅 Today&apos;s Tasks</div>
                {daily.map(t => <TaskCard key={t.id} task={t} onToggle={toggleTask} />)}
              </>
            )}
            {weekly.length > 0 && (
              <>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem', color: '#2D2A4A', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📆 This Week</div>
                {weekly.map(t => <TaskCard key={t.id} task={t} onToggle={toggleTask} />)}
              </>
            )}
            {monthly.length > 0 && (
              <>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem', color: '#2D2A4A', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📅 This Month</div>
                {monthly.map(t => <TaskCard key={t.id} task={t} onToggle={toggleTask} />)}
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px 24px 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 30 }}>
        {[['✅','Tasks',true],['⭐','My Stars',false],['🏅','Badges',false],['🏠','Home',false]].map(([icon, label, active]) => (
          <div key={label as string} onClick={() => label === 'Home' && onNavigate('landing')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: active ? '#FF6B6B' : '#bbb' }}>
            <div style={{ fontSize: '1.5rem' }}>{icon}</div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TaskCard({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <div onClick={() => onToggle(task.id)}
      style={{ background: task.done ? 'linear-gradient(135deg,#F0FFF4,#E8FFF0)' : 'white', border: task.done ? '2px solid #6BCB77' : '2px solid transparent', borderRadius: '20px', padding: '16px 20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', transition: 'all 0.2s' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, background: task.done ? '#6BCB77' : '#fafafa', border: `3px solid ${task.done ? '#6BCB77' : '#ddd'}`, transition: 'all 0.3s' }}>
        {task.done ? '✅' : task.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: task.done ? '#aaa' : '#2D2A4A', textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</div>
        <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 700, marginTop: '2px' }}>{task.freq || task.frequency}</div>
      </div>
      <div style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 800, background: '#FFF9C4', color: '#7a6200' }}>⭐ +{task.stars}</div>
    </div>
  )
}
