import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../pages/LoginForm';

// Mock Supabase - define inside factory to avoid hoisting issues
vi.mock('../lib/supabase', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
    },
    from: vi.fn(function() { return this; }),
    select: vi.fn(function() { return this; }),
    eq: vi.fn(function() { return this; }),
    single: vi.fn(),
  };
  return {
    supabase: mockSupabase,
  };
});

// Import after mock to get the mocked version
import { supabase } from '../lib/supabase';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock chain
    supabase.from.mockReturnValue(supabase);
    supabase.select.mockReturnValue(supabase);
    supabase.eq.mockReturnValue(supabase);
  });

  it('should render login form with email and password fields', () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should allow user to type in email and password fields', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should call Supabase signInWithPassword on form submit', async () => {
    const user = userEvent.setup();
    const mockUser = {
      email: 'test@example.com',
      user_metadata: { email: 'test@example.com' },
    };

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the users table query chain
    supabase.single.mockResolvedValue({
      data: { role_id: 1 },
      error: null,
    });

    renderLoginForm();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    const user = userEvent.setup();
    const { toast } = await import('react-toastify');

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    });

    renderLoginForm();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Login failed. Please check your credentials.'
      );
    });
  });

  it('should have a link to create account page', () => {
    renderLoginForm();

    const createAccountLink = screen.getByRole('link', { name: /create account/i });
    expect(createAccountLink).toBeInTheDocument();
    expect(createAccountLink).toHaveAttribute('href', '/create-account');
  });
});
