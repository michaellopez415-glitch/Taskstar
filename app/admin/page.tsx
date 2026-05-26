'use client'
import { useState } from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminOverview from './components/AdminOverview'
import AdminUsers from './components/AdminUsers'
import AdminBilling from './components/AdminBilling'
import AdminEmails from './components/AdminEmails'
import AdminSecurity from './components/AdminSecurity'
import AdminAlerts from './components/AdminAlerts'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <AdminOverview />
      case 'users': return <AdminUsers />
      case 'billing': return <AdminBilling />
      case 'emails': return <AdminEmails />
      case 'security': return <AdminSecurity />
      case 'alerts': return <AdminAlerts />
      default: return <AdminOverview />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F14', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <AdminSidebar active={activeSection} onNavigate={setActiveSection} />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        {renderSection()}
      </main>
    </div>
  )
}
