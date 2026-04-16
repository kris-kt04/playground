import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginPage } from './login'

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/lib/useSession', () => ({
  useSession: () => ({ session: null, loading: false }),
}))

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
    },
  },
}))

import { authClient } from '@/lib/auth-client'

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Login to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('switches to signup mode when clicking create account', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    await user.click(screen.getByText('Create account'))
    
    expect(screen.getByText('Create account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('shows forgot password link only in login mode', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument()
    
    await user.click(screen.getByText('Create account'))
    
    expect(screen.queryByText('Forgot your password?')).not.toBeInTheDocument()
  })

  it('calls signIn.email on login submit', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: { user: { createdAt: new Date() } },
    })
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Login' }))
    
    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows error message on failed login', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    })
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Login' }))
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('disables button while loading', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.signIn.email).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Login' }))
    
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled()
  })
})