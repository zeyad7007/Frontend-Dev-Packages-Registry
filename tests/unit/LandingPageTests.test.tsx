import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import LandingPage from '../../src/Pages/LandingPage';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom'); // Import original module
  return {
    ...actual,
    useNavigate: vi.fn(), // Override useNavigate
  };
});

describe('LandingPage Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate); // Mock useNavigate
  });

  afterEach(() => {
    vi.resetAllMocks(); // Reset mocks after each test
  });

  test('renders the welcome heading', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Assert the heading is displayed
    expect(screen.getByRole('heading', { name: /Welcome to Fuwwah Package Registry/i })).toBeInTheDocument();
  });

  test('renders the login and tracks buttons', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Assert both buttons are rendered
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tracks/i })).toBeInTheDocument();
  });

  test('navigates to login page when Login button is clicked', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert navigation was triggered with '/login'
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to tracks page when Tracks button is clicked', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /Tracks/i }));

    // Assert navigation was triggered with '/tracks'
    expect(mockNavigate).toHaveBeenCalledWith('/tracks');
  });
});
