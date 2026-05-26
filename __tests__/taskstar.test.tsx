import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import LandingPage from '../app/components/LandingPage'
import AuthScreen from '../app/components/AuthScreen'
import ParentDashboard from '../app/components/ParentDashboard'
import KidDashboard from '../app/components/KidDashboard'

jest.mock('framer-motion', () => ({ motion: { div: 'div' } }))
const noop = () => {}

describe('🏠 Landing Page', () => {
  test.skip('renders Task + Star in logo', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getAllByText('Task').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Star').length).toBeGreaterThan(0)
  })
  test('renders hero headline', () => {
    render(<LandingPage onNavigate={noop} />)
    expect(screen.getByText(/Make chores/i)).toBeInTheDocument()
    expect(screen.getAllByText(/kids/i).length).toBeGreaterThan(0)
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
  test('clicking Log In triggers navigation', () => {
    const mockNav = jest.fn()
    render(<LandingPage onNavigate={mockNav} />)
    fireEvent.click(screen.getByText('Log In'))
    expect(mockNav).toHaveBeenCalledWith('auth', 'login')
  })
  test('clicking Try Free triggers navigation', () => {
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

describe('🔐 Auth Screen', () => {
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
  test('shows free trial subtitle in signup mode', () => {
    render(<AuthScreen mode="signup" onNavigate={noop} onAuth={noop} />)
    expect(screen.getByText(/14-day trial/i)).toBeInTheDocument()
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
  test('clicking login button triggers onAuth with parent role', () => {
    const mockAuth = jest.fn()
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={mockAuth} />)
    fireEvent.click(screen.getByText('→ Log In'))
    expect(mockAuth).toHaveBeenCalledWith('parent')
  })
  test('clicking Child then login calls onAuth with kid', () => {
    const mockAuth = jest.fn()
    render(<AuthScreen mode="login" onNavigate={noop} onAuth={mockAuth} />)
    fireEvent.click(screen.getByText(/Child/i))
    fireEvent.click(screen.getByText('→ Log In'))
    expect(mockAuth).toHaveBeenCalledWith('kid')
  })
  test('back to home link triggers navigation', () => {
    const mockNav = jest.fn()
    render(<AuthScreen mode="login" onNavigate={mockNav} onAuth={noop} />)
    fireEvent.click(screen.getByText(/Back to home/i))
    expect(mockNav).toHaveBeenCalledWith('landing')
  })
})

describe('👩 Parent Dashboard', () => {
  test('renders greeting', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText(/Good morning, Sarah/i)).toBeInTheDocument()
  })
  test('renders all 3 kids', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getAllByText('Emma').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Jake').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Lily').length).toBeGreaterThan(0)
  })
  test('renders weekly stats section', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText(/Snapshot/i)).toBeInTheDocument()
    expect(screen.getByText('Tasks Completed')).toBeInTheDocument()
    expect(screen.getByText('Tasks Missed')).toBeInTheDocument()
    expect(screen.getByText('Completion Rate')).toBeInTheDocument()
  })
  test('renders correct stat numbers', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText('18')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
  })
  test('renders prize goals for each kid', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText(/New Game/i)).toBeInTheDocument()
    expect(screen.getByText(/New Bike/i)).toBeInTheDocument()
    expect(screen.getByText(/Theme Park/i)).toBeInTheDocument()
  })
  test('renders Add Task form', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByPlaceholderText(/Make your bed/i)).toBeInTheDocument()
  })
  test('renders frequency selector', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText('Daily')).toBeInTheDocument()
  })
  test('renders All Kids option in dropdown', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText('All Kids')).toBeInTheDocument()
  })
  test('renders earned badges', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText(/7-Day Streak/i)).toBeInTheDocument()
    expect(screen.getByText(/On Fire/i)).toBeInTheDocument()
  })
  test('renders locked badges', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText(/30-Day Champ/i)).toBeInTheDocument()
    expect(screen.getByText(/Perfect Month/i)).toBeInTheDocument()
  })
  test('Kid View button navigates to kid dashboard', () => {
    const mockNav = jest.fn()
    render(<ParentDashboard onNavigate={mockNav} />)
    fireEvent.click(screen.getAllByText(/Kid View/i)[0])
    expect(mockNav).toHaveBeenCalledWith('kid-dash')
  })
  test('Log out navigates to landing', () => {
    const mockNav = jest.fn()
    render(<ParentDashboard onNavigate={mockNav} />)
    fireEvent.click(screen.getByText('Log out'))
    expect(mockNav).toHaveBeenCalledWith('landing')
  })
  test('renders navigation tabs', () => {
    render(<ParentDashboard onNavigate={noop} />)
    expect(screen.getByText(/Overview/i)).toBeInTheDocument()
    expect(screen.getByText(/Add Tasks/i)).toBeInTheDocument()
    expect(screen.getByText(/Reports/i)).toBeInTheDocument()
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
  })
})

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
  test('renders prize progress percentage', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText(/68/)).toBeInTheDocument()
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
    const completed = screen.getAllByText('✅')
    expect(completed.length).toBeGreaterThanOrEqual(3)
  })
  test('renders star values on tasks', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getAllByText(/⭐ \+5/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/⭐ \+15/).length).toBeGreaterThan(0)
  })
  test('completing a task adds a checkmark', () => {
    render(<KidDashboard onNavigate={noop} />)
    const before = screen.getAllByText('✅').length
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    const after = screen.getAllByText('✅').length
    expect(after).toBeGreaterThan(before)
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
  test('renders motivational speech bubble', () => {
    render(<KidDashboard onNavigate={noop} />)
    expect(screen.getByText(/Complete your tasks/i)).toBeInTheDocument()
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
  test('unchecking a task removes the checkmark', () => {
    render(<KidDashboard onNavigate={noop} />)
    const cleanRoom = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoom!)
    fireEvent.click(screen.getByText(/Woohoo/i))
    const before = screen.getAllByText('✅').length
    const cleanRoomAgain = screen.getByText("Clean your room").closest('div[class*="rounded"]') as HTMLElement
    fireEvent.click(cleanRoomAgain!)
    expect(screen.getAllByText('✅').length).toBeLessThan(before)
  })
})
