'use client'
import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AuthScreen from './components/AuthScreen'
import ParentDashboard from './components/ParentDashboard'
import KidDashboard from './components/KidDashboard'

export default function Home() {
  const [screen, setScreen] = useState('landing')
  const [authMode, setAuthMode] = useState('signup')

  const navigate = (s: string, mode?: string) => {
    if (mode) setAuthMode(mode)
    setScreen(s)
    window.scrollTo(0, 0)
  }

  const handleAuth = (role: string) => {
    navigate(role === 'kid' ? 'kid-dash' : 'parent-dash')
  }

  return (
    <>
      {screen === 'landing' && <LandingPage onNavigate={navigate} />}
      {screen === 'auth' && <AuthScreen mode={authMode} onNavigate={navigate} onAuth={handleAuth} />}
      {screen === 'parent-dash' && <ParentDashboard onNavigate={navigate} />}
      {screen === 'kid-dash' && <KidDashboard onNavigate={navigate} />}
    </>
  )
}
