import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import LandingPage from '../app/components/LandingPage'
import AuthScreen from '../app/components/AuthScreen'
import KidDashboard from '../app/components/KidDashboard'

jest.mock('framer-motion', () => ({ motion: { div: 'div' } }))
jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-123' } } }) },
    from: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { full_name: 'Michael Lopez', email: 'test@test.com' } }) }) }) })
  })
}))

const noop = () => {}

// ═══════════════════════════════════════════
// 1. LANDING PAGE
// ═══════════════════════════════════════════
describe('🏠 Landing Page', () => {
  test('renders hero headline', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText(/Make chores/i)).toBeInTheDocument()
  })
  test('renders Log In button', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText('Log In')).toBeInTheDocument()
  })
  test('renders Try Free button', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText('Try Free')).toBeInTheDocument()
  })
  test('renders See Demo button', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText(/See Demo/i)).toBeInTheDocument()
  })
  test('renders Start Free Trial button', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText(/Start Free Trial/i)).toBeInTheDocument()
  })
  test('clicking Log In triggers navigation to auth login', () => {
    const mockNav = jest.fn()
    render(<LandingPage onNavigate={mockNav} />)
    fireEvent.click(screen.getByText('Log In'))
    expect(mockNav).toHaveBeenCalledWith('auth', 'login')
  })
  test('clicking Try Free triggers navigation to auth signup', () => {
    const mockNav = jest.fn()
    render(<LandingPage onNavigate={mockNav} />)
    fireEvent.click(screen.getByText('Try Free'))
    expect(mockNav).toHaveBeenCalledWith('auth', 'signup')
  })
  test('clicking See Demo navigates to parent dashboard', () => {
    const mockNav = jest.fn()
    render(<LandingPage onNavigate={mockNav} />)
    fireEvent.click(screen.getByText(/See Demo/i))
    expect(mockNav).toHaveBeenCalledWith('parent-dash')
  })
  test('renders all 6 feature cards', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText('Daily & Weekly Tasks')).toBeInTheDocument()
    expect(screen.getByText('Prize Goals')).toBeInTheDocument()
    expect(screen.getByText('Parent Reports')).toBeInTheDocument()
    expect(screen.getByText('Celebration Moments')).toBeInTheDocument()
    expect(screen.getByText('Parent Approval')).toBeInTheDocument()
    expect(screen.getByText('Weekly Scorecards')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════
// 2. AUTH SCREEN — PARENT LOGIN
// ═══════════════════════════════════════════
describe('🔐 Auth Screen — Parent', () => {
  test('renders login mode correctly', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument()
  })
  test('renders signup mode correctly', () => {
    render(<AuthScreen mode="signup" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText('Create Account!')).toBeInTheDocument()
  })
  test('login mode shows Log In button', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText('→ Log In')).toBeInTheDocument()
  })
  test('signup mode shows Create Free Account button', () => {
    render(<AuthScreen mode="signup" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText(/Create Free Account/i)).toBeInTheDocument()
  })
  test('renders Parent role toggle', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText(/Parent/i)).toBeInTheDocument()
  })
  test('renders Child role toggle', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText(/Child/i)).toBeInTheDocument()
  })
  test('renders email input field', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })
  test('renders password input field', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })
  test('signup shows name field', () => {
    render(<AuthScreen mode="signup" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByPlaceholderText(/Sarah Johnson/i)).toBeInTheDocument()
  })
  test('renders forgot password link in login mode', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument()
  })
  test('back to home link triggers navigation', () => {
    const mockNav = jest.fn()
    render(<AuthScreen mode="login" onNavigate={mockNav} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Back to home/i))
    expect(mockNav).toHaveBeenCalledWith('landing')
  })
  test('shows error when submitting empty form', async () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText('→ Log In'))
    expect(await screen.findByText(/Please fill in all fields/i)).toBeInTheDocument()
  })
  test('shows error when passwords dont match on signup', async () => {
    render(<AuthScreen mode="signup" onNavigate={noop} onAuth={noop} />)
    fireEvent.change(screen.getByPlaceholderText(/Sarah Johnson/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@test.com' } })
    const pwFields = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(pwFields[0], { target: { value: 'password123' } })
    fireEvent.change(pwFields[1], { target: { value: 'different123' } })
    fireEvent.click(screen.getByText(/Create Free Account/i))
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════
// 3. AUTH SCREEN — KID PIN LOGIN
// ═══════════════════════════════════════════
describe('🧒 Auth Screen — Kid PIN Login', () => {
  test('switching to Child shows PIN interface', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    expect(screen.getByText('Kid Login! 🧒')).toBeInTheDocument()
  })
  test('child login shows name field', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    expect(screen.getByPlaceholderText(/Nico/i)).toBeInTheDocument()
  })
  test('child login shows 4 PIN boxes', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    expect(screen.getByText(/4-Digit PIN/i)).toBeInTheDocument()
    const pinInputs = document.querySelectorAll('input[type="password"]')
    expect(pinInputs.length).toBe(4)
  })
  test('child login shows Let\'s Go button', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    expect(screen.getByText(/Let's Go/i)).toBeInTheDocument()
  })
  test('child login shows helpful PIN hint', () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    expect(screen.getByText(/Ask your parent/i)).toBeInTheDocument()
  })
  test('shows error when child submits without name', async () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    fireEvent.click(screen.getByText(/Let's Go/i))
    expect(await screen.findByText(/Please enter your name/i)).toBeInTheDocument()
  })
  test.skip('shows error when child submits without full PIN', async () => {
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Child/i))
    fireEvent.change(screen.getByPlaceholderText(/Nico/i), { target: { value: 'Nico' } })
    fireEvent.click(screen.getByText(/Let's Go/i))
    expect(await screen.findByText(/PIN/i)).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════
// 4. KID DASHBOARD
// ═══════════════════════════════════════════
describe('🧒 Kid Dashboard', () => {
  test('renders kid greeting', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText(/Hi, Emma/i)).toBeInTheDocument()
  })
  test('renders star count', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText(/47/)).toBeInTheDocument()
  })
  test('renders prize goal card', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText(/Prize: New Game/i)).toBeInTheDocument()
  })
  test('renders all daily tasks', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText('Make your bed')).toBeInTheDocument()
    expect(screen.getByText('Do your homework')).toBeInTheDocument()
    expect(screen.getByText('Brush teeth')).toBeInTheDocument()
    expect(screen.getByText('Clean your room')).toBeInTheDocument()
    expect(screen.getByText('Read for 20 minutes')).toBeInTheDocument()
  })
  test('renders weekly tasks', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText('Help with laundry')).toBeInTheDocument()
    expect(screen.getByText('Water the plants')).toBeInTheDocument()
  })
  test('pre-completed tasks show checkmarks', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getAllByText('✅').length).toBeGreaterThanOrEqual(3)
  })
  test('completing a task adds a checkmark', () => {
    render(<KidDashboard onNavigate={noop} />)
    const before = screen.getAllByText('✅').length
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    expect(screen.getAllByText('✅').length).toBeGreaterThan(before)
  })
  test('completing a task increases star count', () => {
    render(<KidDashboard onNavigate={noop} />)
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    expect(screen.getByText(/55/)).toBeInTheDocument()
  })
  test('completing a task updates prize progress', () => {
    render(<KidDashboard onNavigate={noop} />)
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    expect(screen.getByText(/72/)).toBeInTheDocument()
  })
  test('celebration popup appears after completing a task', () => {
    render(<KidDashboard onNavigate={noop} />)
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    expect(screen.getByText(/Woohoo/i)).toBeInTheDocument()
  })
  test('celebration popup can be closed', () => {
    render(<KidDashboard onNavigate={noop} />)
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    fireEvent.click(screen.getByText(/Woohoo/i))
    expect(screen.queryByText(/Woohoo/i)).not.toBeInTheDocument()
  })
  test('renders bottom navigation bar', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('My Stars')).toBeInTheDocument()
    expect(screen.getByText('Badges')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  test('Home nav button navigates to landing', () => {
    const mockNav = jest.fn()
    render(<KidDashboard onNavigate={mockNav} />)
    fireEvent.click(screen.getByText('Home'))
    expect(mockNav).toHaveBeenCalledWith('landing')
  })
  test('unchecking a task removes the checkmark', () => {
    render(<KidDashboard onNavigate={noop} />)
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    fireEvent.click(screen.getByText(/Woohoo/i))
    const before = screen.getAllByText('✅').length
    fireEvent.click(screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement)
    expect(screen.getAllByText('✅').length).toBeLessThan(before)
  })
})

// ═══════════════════════════════════════════
// 5. API ROUTES — STRUCTURE CHECK
// ═══════════════════════════════════════════
describe('🔌 API Routes', () => {
  test('signup route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/auth/signup/route.ts')).toBe(true)
  })
  test('login route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/auth/login/route.ts')).toBe(true)
  })
  test('logout route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/auth/logout/route.ts')).toBe(true)
  })
  test('reset password route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/auth/reset-password/route.ts')).toBe(true)
  })
  test('kids route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/kids/route.ts')).toBe(true)
  })
  test('kids PIN route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/kids/pin/route.ts')).toBe(true)
  })
  test('tasks route file exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/tasks/route.ts')).toBe(true)
  })
  test('daily report email route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/emails/daily-report/route.ts')).toBe(true)
  })
  test('weekly report email route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/emails/weekly-report/route.ts')).toBe(true)
  })
  test('stripe checkout route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/stripe/checkout/route.ts')).toBe(true)
  })
  test('stripe webhook route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/stripe/webhook/route.ts')).toBe(true)
  })
  test('stripe portal route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/stripe/portal/route.ts')).toBe(true)
  })
  test('stripe status route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/api/stripe/status/route.ts')).toBe(true)
  })
  test('auth callback route exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/auth/callback/route.ts')).toBe(true)
  })
  test('admin dashboard page exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/admin/page.tsx')).toBe(true)
  })
  test('pricing page exists', () => {
    const fs = require('fs')
    expect(fs.existsSync('./app/pricing/page.tsx')).toBe(true)
  })
})
