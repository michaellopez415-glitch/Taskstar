'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Kid {
  id: string
  name: string
  age: number
  emoji: string
  prize_name: string
  prize_emoji: string
  prize_pct: number
  total_stars: number
  tasks: Task[]
}

interface Task {
  id: string
  label: string
  frequency: string
  stars: number
  done: boolean
  icon: string
}

interface ParentDashboardProps {
  onNavigate: (screen: string, mode?: string) => void
}

export default function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState('📋 Overview')
  const [kids, setKids] = useState<Kid[]>([])
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ label: '', kid_id: '', frequency: 'Daily' })
  const [newKid, setNewKid] = useState({ name: '', age: '', emoji: '🧒', prize_name: '', prize_emoji: '🎁' })
  const [addingKid, setAddingKid] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { onNavigate('auth', 'login'); return }

    const { data: prof } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single()
    setProfile(prof)

    const { data: kidsData } = await supabase.from('kids').select('*, tasks(*)').eq('parent_id', user.id).order('created_at', { ascending: true })
    setKids(kidsData || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    onNavigate('landing')
  }

  const handleAddTask = async () => {
    if (!newTask.label || !newTask.kid_id) { setMsg('Please fill in task name and select a kid!'); return }
    setSaving(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, stars: 5 }),
    })
    if (res.ok) {
      setMsg('Task added! ✅')
      setNewTask({ label: '', kid_id: '', frequency: 'Daily' })
      loadData()
    } else {
      setMsg('Error adding task. Please try again.')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleAddKid = async () => {
    if (!newKid.name) { setMsg('Please enter your child\'s name!'); return }
    setSaving(true)
    const res = await fetch('/api/kids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newKid, age: parseInt(newKid.age) || 8 }),
    })
    if (res.ok) {
      setMsg('Child added! ✅')
      setNewKid({ name: '', age: '', emoji: '🧒', prize_name: '', prize_emoji: '🎁' })
      setAddingKid(false)
      loadData()
    } else {
      setMsg('Error adding child. Please try again.')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleToggleTask = async (taskId: string, done: boolean) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, done: !done }),
    })
    loadData()
  }

  const tabs = ['📋 Overview', '➕ Add Tasks', '👶 Add Child', '📊 Reports', '⚙️ Settings']
  const firstName = profile?.full_name?.split(' ')[0] || 'Parent'
  const totalDone = kids.reduce((s, k) => s + (k.tasks?.filter(t => t.done).length || 0), 0)
  const totalTasks = kids.reduce((s, k) => s + (k.tasks?.length || 0), 0)
  const completionRate = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F8FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⭐</div>
          <div style={{ fontWeight: 800, color: '#2D2A4A' }}>Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FC', fontFamily: "'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="bg-white px-8 py-5 flex items-center justify-between sticky top-0 z-50" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="font-fredoka text-2xl" style={{ color: 'var(--dark)' }}>
          Task<span style={{ color: 'var(--coral)' }}>Star</span> ⭐
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: '#FFE0E0' }}>👩</div>
          <span className="font-extrabold text-sm" style={{ color: 'var(--dark)' }}>{firstName} (Parent)</span>
          <button onClick={handleLogout} className="ml-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gray-100 hover:bg-gray-200 transition-colors">Log out</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Greeting */}
        <div className="mb-7">
          <h2 className="font-fredoka text-3xl" style={{ color: 'var(--dark)' }}>Good morning, {firstName}! ☀️</h2>
          <p className="text-gray-400 font-semibold text-sm mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {kids.length} kids in your family</p>
        </div>

        {/* Message */}
        {msg && <div className="mb-4 px-4 py-3 rounded-xl font-bold text-sm" style={{ background: msg.includes('✅') ? '#F0FFF4' : '#FFF0F0', color: msg.includes('✅') ? '#2D7A2D' : '#CC0000', border: `1px solid ${msg.includes('✅') ? '#6BCB77' : '#FF6B6B'}` }}>{msg}</div>}

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 bg-white p-1.5 rounded-2xl w-fit" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className="px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all"
              style={{ background: activeTab === t ? 'var(--dark)' : 'transparent', color: activeTab === t ? 'white' : '#888' }}>{t}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === '📋 Overview' && (
          <>
            {/* Stats */}
            <div className="mb-8">
              <h3 className="font-fredoka text-xl mb-4" style={{ color: 'var(--dark)' }}>📈 This Week&apos;s Snapshot</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
                {[[totalDone.toString(),'Tasks Completed','#6BCB77'],[(totalTasks-totalDone).toString(),'Tasks Pending','#FF6B6B'],[`${completionRate}%`,'Completion Rate','#6EC6F5'],[kids.length.toString(),'Active Kids','#9B72CF']].map(([n,l,c]) => (
                  <div key={l} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)' }}>
                    <span className="font-fredoka text-4xl block" style={{ color: c }}>{n}</span>
                    <span className="text-xs text-gray-400 font-bold mt-1 block">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids */}
            <h3 className="font-fredoka text-xl mb-4" style={{ color: 'var(--dark)' }}>👨‍👩‍👧‍👦 Your Kids</h3>
            {kids.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '12px' }}>👶</div>
                <h3 className="font-fredoka text-2xl mb-2" style={{ color: 'var(--dark)' }}>No kids added yet!</h3>
                <p className="text-gray-400 font-semibold mb-4">Click &quot;Add Child&quot; tab to add your first child</p>
                <button onClick={() => setActiveTab('👶 Add Child')} className="px-6 py-3 rounded-2xl font-extrabold text-white" style={{ background: 'var(--coral)' }}>+ Add Your First Child</button>
              </div>
            ) : (
              <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
                {kids.map((kid, idx) => {
                  const colors = ['#6BCB77','#6EC6F5','#FFB347','#9B72CF','#FF6B6B']
                  const color = colors[idx % colors.length]
                  const doneTasks = kid.tasks?.filter(t => t.done).length || 0
                  const totalKidTasks = kid.tasks?.length || 0
                  return (
                    <div key={kid.id} className="bg-white rounded-3xl p-6 transition-all hover:-translate-y-0.5" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)', borderTop: `5px solid ${color}` }}>
                      <div className="flex items-center gap-3 mb-4">
                        <span style={{ fontSize: '2.5rem' }}>{kid.emoji}</span>
                        <div>
                          <h4 className="font-fredoka text-xl" style={{ color: 'var(--dark)' }}>{kid.name}</h4>
                          <span className="text-xs text-gray-400 font-bold">Age {kid.age} · {totalKidTasks} tasks</span>
                        </div>
                      </div>
                      {kid.prize_name && (
                        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 mb-4 text-sm font-extrabold" style={{ background: 'linear-gradient(135deg,#FFF9C4,#FFE082)', color: '#7a6200' }}>
                          {kid.prize_emoji} {kid.prize_name} · {kid.prize_pct}% there!
                        </div>
                      )}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-extrabold text-gray-500 mb-1.5">
                          <span>Tasks done</span><span>{doneTasks}/{totalKidTasks}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${totalKidTasks > 0 ? (doneTasks/totalKidTasks)*100 : 0}%`, background: `linear-gradient(90deg,${color},${color}cc)` }} />
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {(kid.tasks || []).slice(0, 5).map(t => (
                          <li key={t.id} onClick={() => handleToggleTask(t.id, t.done)} className="flex items-center gap-2 text-sm font-bold text-gray-600 py-1 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded px-1">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: t.done ? color : 'white', border: `2.5px solid ${t.done ? color : '#ddd'}`, color: 'white' }}>
                              {t.done ? '✓' : ''}
                            </div>
                            <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#aaa' : 'inherit' }}>{t.label}</span>
                            <span className="ml-auto text-xs" style={{ color: '#FFB347' }}>⭐{t.stars}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => { setActiveTab('➕ Add Tasks'); setNewTask(prev => ({ ...prev, kid_id: kid.id })) }} className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-gray-100 hover:bg-gray-200 transition-colors">✏️ Add Task</button>
                        <button onClick={() => onNavigate('kid-dash')} className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white transition-all hover:opacity-90" style={{ background: 'var(--coral)' }}>👁 Kid View</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Add Tasks Tab */}
        {activeTab === '➕ Add Tasks' && (
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)', maxWidth: '560px' }}>
            <h3 className="font-fredoka text-2xl mb-6" style={{ color: 'var(--dark)' }}>➕ Add a New Task</h3>
            {kids.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 font-semibold mb-4">Add a child first before creating tasks!</p>
                <button onClick={() => setActiveTab('👶 Add Child')} className="px-6 py-3 rounded-2xl font-extrabold text-white" style={{ background: 'var(--coral)' }}>+ Add a Child First</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Task Name</label>
                  <input type="text" value={newTask.label} onChange={e => setNewTask({...newTask, label: e.target.value})} placeholder="e.g. Make your bed"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Assign To</label>
                  <select value={newTask.kid_id} onChange={e => setNewTask({...newTask, kid_id: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors">
                    <option value="">Select a child...</option>
                    {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    <option value="all">All Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Frequency</label>
                  <select value={newTask.frequency} onChange={e => setNewTask({...newTask, frequency: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors">
                    <option>Daily</option><option>Weekly</option><option>Monthly</option>
                  </select>
                </div>
                <button onClick={handleAddTask} disabled={saving}
                  className="w-full py-4 rounded-2xl font-extrabold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: saving ? '#ccc' : 'var(--mint)' }}>
                  {saving ? 'Adding...' : '+ Add Task'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Child Tab */}
        {activeTab === '👶 Add Child' && (
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)', maxWidth: '560px' }}>
            <h3 className="font-fredoka text-2xl mb-6" style={{ color: 'var(--dark)' }}>👶 Add a Child</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Child&apos;s Name</label>
                <input type="text" value={newKid.name} onChange={e => setNewKid({...newKid, name: e.target.value})} placeholder="e.g. Emma"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Age</label>
                <input type="number" value={newKid.age} onChange={e => setNewKid({...newKid, age: e.target.value})} placeholder="e.g. 8" min="1" max="17"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Emoji Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {['🧒','👦','👧','🧑','👨','👩'].map(e => (
                    <button key={e} onClick={() => setNewKid({...newKid, emoji: e})}
                      className="text-3xl p-2 rounded-xl transition-all"
                      style={{ background: newKid.emoji === e ? '#FFE0E0' : '#F5F5F5', border: newKid.emoji === e ? '2px solid var(--coral)' : '2px solid transparent' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Prize Goal Name (optional)</label>
                <input type="text" value={newKid.prize_name} onChange={e => setNewKid({...newKid, prize_name: e.target.value})} placeholder="e.g. New Game"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold outline-none focus:border-sky-300 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-500 mb-1.5">Prize Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {['🎮','🚲','🎠','🏖️','🎁','🦄','⚽','🎨'].map(e => (
                    <button key={e} onClick={() => setNewKid({...newKid, prize_emoji: e})}
                      className="text-2xl p-2 rounded-xl transition-all"
                      style={{ background: newKid.prize_emoji === e ? '#FFF9C4' : '#F5F5F5', border: newKid.prize_emoji === e ? '2px solid #FFD93D' : '2px solid transparent' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleAddKid} disabled={saving}
                className="w-full py-4 rounded-2xl font-extrabold text-white transition-all hover:-translate-y-0.5"
                style={{ background: saving ? '#ccc' : 'var(--coral)' }}>
                {saving ? 'Adding...' : '+ Add Child'}
              </button>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === '📊 Reports' && (
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)' }}>
            <h3 className="font-fredoka text-2xl mb-6" style={{ color: 'var(--dark)' }}>📊 Email Reports</h3>
            <p className="text-gray-500 font-semibold mb-6">Send a report to your email right now:</p>
            <div className="flex gap-4">
              <button onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) { await fetch('/api/emails/daily-report', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ parent_id: user.id }) }); setMsg('Daily report sent to your email! ✅') }
              }} className="flex-1 py-4 rounded-2xl font-extrabold text-white" style={{ background: 'var(--sky)' }}>
                📧 Send Daily Report
              </button>
              <button onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) { await fetch('/api/emails/weekly-report', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ parent_id: user.id }) }); setMsg('Weekly report sent to your email! ✅') }
              }} className="flex-1 py-4 rounded-2xl font-extrabold text-white" style={{ background: 'var(--purple)' }}>
                📊 Send Weekly Report
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === '⚙️ Settings' && (
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 32px rgba(45,42,74,0.1)', maxWidth: '480px' }}>
            <h3 className="font-fredoka text-2xl mb-6" style={{ color: 'var(--dark)' }}>⚙️ Account Settings</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl" style={{ background: '#F7F8FC' }}>
                <div className="text-xs font-extrabold text-gray-400 mb-1">NAME</div>
                <div className="font-bold text-gray-700">{profile?.full_name}</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ background: '#F7F8FC' }}>
                <div className="text-xs font-extrabold text-gray-400 mb-1">EMAIL</div>
                <div className="font-bold text-gray-700">{profile?.email}</div>
              </div>
              <button onClick={() => window.location.href = '/pricing'} className="w-full py-4 rounded-2xl font-extrabold text-white mt-4" style={{ background: 'var(--coral)' }}>
                💳 Manage Subscription
              </button>
              <button onClick={handleLogout} className="w-full py-3 rounded-2xl font-extrabold bg-gray-100 hover:bg-gray-200 transition-colors" style={{ color: 'var(--dark)' }}>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
