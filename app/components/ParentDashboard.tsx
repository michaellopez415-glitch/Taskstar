'use client'
import { useState } from 'react'

interface ParentDashboardProps {
  onNavigate: (screen: string, mode?: string) => void
}

const kids = [
  { name: 'Emma', age: 10, emoji: '🧒', color: '#6BCB77', prize: '🎮 New Game', pct: 68, done: 3, total: 5,
    tasks: ['Make bed','Homework','Brush teeth','Clean room','Read 20 mins'], completed: [true,true,true,false,false] },
  { name: 'Jake', age: 8, emoji: '👦', color: '#6EC6F5', prize: '🚲 New Bike', pct: 42, done: 1, total: 4,
    tasks: ['Feed the dog','Tidy bedroom','Practice piano','Homework'], completed: [true,false,false,false] },
  { name: 'Lily', age: 6, emoji: '👧', color: '#FFB347', prize: '🎠 Theme Park', pct: 25, done: 2, total: 3,
    tasks: ['Put toys away','Get dressed','Help set table'], completed: [true,true,false] },
]

export default function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const tabs = ['📋 Overview','➕ Add Tasks','📊 Reports','⚙️ Settings']

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FC' }}>
      {/* Header */}
      <header className="bg-white px-8 py-5 flex items-center justify-between sticky top-0 z-50"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="font-fredoka text-2xl" style={{ color: 'var(--dark)' }}>
          Task<span style={{ color: 'var(--coral)' }}>Star</span> ⭐
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: '#FFE0E0' }}>👩</div>
          <span className="font-extrabold text-sm" style={{ color: 'var(--dark)' }}>Sarah (Parent)</span>
          <button onClick={() => onNavigate('landing')}
            className="ml-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gray-100 hover:bg-gray-200 transition-colors">
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Greeting */}
        <div className="mb-7">
          <h2 className="font-fredoka text-3xl" style={{ color: 'var(--dark)' }}>Good morning, Sarah! ☀️</h2>
          <p className="text-gray-400 font-semibold text-sm mt-0.5">Monday, May 26 · 2 of 3 kids have tasks due today</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 bg-white p-1.5 rounded-2xl w-fit" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(t)}
              className="px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all"
              style={{ background: activeTab === t ? 'var(--dark)' : 'transparent', color: activeTab === t ? 'white' : '#888' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h3 className="font-fredoka text-xl mb-4 flex items-center gap-2" style={{ color: 'var(--dark)' }}>
            📈 This Week&apos;s Snapshot
          </h3>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
            {[['18','Tasks Completed','#6BCB77'],['4','Tasks Missed','#FF6B6B'],['82%','Completion Rate','#6EC6F5'],['3','Active Kids','#9B72CF']].map(([n,l,c]) => (
              <div key={l} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)' }}>
                <span className="font-fredoka text-4xl block" style={{ color: c }}>{n}</span>
                <span className="text-xs text-gray-400 font-bold mt-1 block">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kids Cards */}
        <h3 className="font-fredoka text-xl mb-4 flex items-center gap-2" style={{ color: 'var(--dark)' }}>
          👨‍👩‍👧‍👦 Your Kids
        </h3>
        <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {kids.map((kid) => (
            <div key={kid.name} className="bg-white rounded-3xl p-6 transition-all hover:-translate-y-0.5"
              style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)', borderTop: `5px solid ${kid.color}` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{kid.emoji}</span>
                <div>
                  <h4 className="font-fredoka text-xl" style={{ color: 'var(--dark)' }}>{kid.name}</h4>
                  <span className="text-xs text-gray-400 font-bold">Age {kid.age} · {kid.total} tasks today</span>
                </div>
              </div>
              <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 mb-4 text-sm font-extrabold"
                style={{ background: 'linear-gradient(135deg,#FFF9C4,#FFE082)', color: '#7a6200' }}>
                {kid.prize} · {kid.pct}% there!
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-extrabold text-gray-500 mb-1.5">
                  <span>Today&apos;s tasks</span><span>{kid.done}/{kid.total} done</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(kid.done/kid.total)*100}%`, background: `linear-gradient(90deg,${kid.color},${kid.color}cc)` }} />
                </div>
              </div>
              <ul className="space-y-1.5">
                {kid.tasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-600 py-1 border-b border-gray-50 last:border-0">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: kid.completed[i] ? kid.color : 'white', border: `2.5px solid ${kid.completed[i] ? kid.color : '#ddd'}`, color: 'white' }}>
                      {kid.completed[i] ? '✓' : ''}
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-gray-100 hover:bg-gray-200 transition-colors">✏️ Edit Tasks</button>
                <button onClick={() => onNavigate('kid-dash')}
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white transition-all hover:opacity-90"
                  style={{ background: 'var(--coral)' }}>
                  👁 Kid View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Panel */}
        <h3 className="font-fredoka text-xl mb-4" style={{ color: 'var(--dark)' }}>➕ Add a New Task</h3>
        <div className="bg-white rounded-3xl p-7 mb-8" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)' }}>
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Task Name</label>
              <input type="text" placeholder="e.g. Make your bed"
                className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-sm outline-none focus:border-sky-300 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Assign To</label>
              <select className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-sm outline-none focus:border-sky-300 transition-colors">
                <option>Emma</option><option>Jake</option><option>Lily</option><option>All Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Frequency</label>
              <select className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-sm outline-none focus:border-sky-300 transition-colors">
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block text-xs font-extrabold text-gray-500 mb-1.5">&nbsp;</label>
              <button className="px-5 py-3 rounded-2xl font-extrabold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--mint)' }}>
                + Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <h3 className="font-fredoka text-xl mb-4" style={{ color: 'var(--dark)' }}>🏅 Emma&apos;s Badges</h3>
        <div className="flex gap-3 flex-wrap">
          {[['⭐ 7-Day Streak',true],['🌟 First Week Complete',true],['🔥 On Fire!',true],['💎 30-Day Champ',false],['👑 Perfect Month',false]].map(([b, earned]) => (
            <div key={b as string} className="bg-white rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm font-extrabold"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', opacity: earned ? 1 : 0.4,
                border: earned ? '2.5px solid var(--sun)' : '2.5px solid transparent',
                background: earned ? 'linear-gradient(135deg,#FFF9C4,#FFFDE7)' : 'white', color: 'var(--dark)' }}>
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
