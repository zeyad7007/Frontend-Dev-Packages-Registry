import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock the API module
vi.mock('../../src/api');

// Import the mocked function
import { authenticate } from '../../src/api';
import Authenticate from '../../src/Components/Authenticate';
import { isAxiosError } from 'axios';

// Get the typed mock function
const mockedAuthenticate = vi.mocked(authenticate);

describe('Authenticate Component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    // Reset mocks and clear storage
    mockOnLogin.mockClear();
    mockedAuthenticate.mockReset();
    localStorage.clear();
  });

  test('renders input fields and login button', () => {
    render(<Authenticate onLogin={mockOnLogin} />);

    // Assert: Input fields are present
    expect(screen.getByLabelText('Enter Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter Password')).toBeInTheDocument();

    // Assert: Login button is present
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls onLogin with the token on successful login', async () => {
    // Mock a successful API response
    mockedAuthenticate.mockResolvedValue({ token: 'mock-token' });

    render(<Authenticate onLogin={mockOnLogin} />);

    // Simulate user input
    await userEvent.type(screen.getByLabelText('Enter Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Enter Password'), 'testpass');

    // Click the login button
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    // Wait for success message
    await screen.findByText(/authenticated!/i);

    // Assert: onLogin is called with the token
    expect(mockOnLogin).toHaveBeenCalledWith('mock-token');

    // Assert: Success message is displayed
    expect(screen.getByText(/testuser is authenticated/i)).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
    // Mock an API response for failed login
    mockedAuthenticate.mockRejectedValue({
      isAxiosError : true,
      response: {
        status: 401,
        data: { error: 'Invalid credentials' },
      },
    });

    render(<Authenticate onLogin={mockOnLogin} />);

    // Simulate user input
    await userEvent.type(screen.getByLabelText('Enter Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Enter Password'), 'testpass');

    // Click the login button
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    // Assert: Error message is displayed
    await screen.findByText(/Error 401: Invalid credentials/i);
    expect(screen.getByText(/Error 401: Invalid credentials/i)).toBeInTheDocument();
  });

  test('displays generic error message on unexpected error', async () => {
    // Mock a generic API error
    mockedAuthenticate.mockRejectedValue(new Error('Network error'));

    render(<Authenticate onLogin={mockOnLogin} />);

    // Simulate user input
    await userEvent.type(screen.getByLabelText('Enter Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Enter Password'), 'testpass');

    // Click the login button
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    // Assert: Generic error message is displayed
    await screen.findByText(/an unexpected error occurred/i);
    expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
  });

});
