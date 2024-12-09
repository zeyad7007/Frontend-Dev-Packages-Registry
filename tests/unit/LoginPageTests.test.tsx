import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../src/Pages/LoginPage';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();
const mockSetIsAuthenticated = vi.fn();

// Mock `useNavigate` to intercept navigation calls
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

// Mock `Authenticate` component
vi.mock('../../src/Components/Authenticate', () => ({
  default: ({ onLogin }) => (
    <button onClick={() => onLogin('mock-token')}>Mock Login</button>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear mock calls and localStorage before each test
    mockNavigate.mockClear();
    mockSetIsAuthenticated.mockClear();
    localStorage.clear();
  });

  test('renders the card with correct styles', () => {
    render(
      <MemoryRouter>
        <LoginPage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    // Target the card element using data-testid
    const card = screen.getByTestId('login-card');
    expect(card).toHaveStyle({ maxWidth: '400px', width: '100%' });
  });

  test('renders the login form', () => {
    render(
      <MemoryRouter>
        <LoginPage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    // Target the heading element with the text 'Login'
    const loginHeading = screen.getByRole('heading', { name: /login/i });
    expect(loginHeading).toBeInTheDocument();
  });

  test('does not call setIsAuthenticated or navigate without user interaction', () => {
    render(
      <MemoryRouter>
        <LoginPage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    // Assert: Ensure no side effects occur without user interaction
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  
});
