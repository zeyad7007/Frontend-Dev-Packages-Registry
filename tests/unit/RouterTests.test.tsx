import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';
import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Helper function to simulate navigation
const navigateTo = (path: string) => {
  window.history.pushState({}, 'Test page', path);
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test to reset authentication state
    localStorage.clear();
  });

  test('renders the LandingPage component on /', () => {
    navigateTo('/');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Welcome to Fuwwah Package Registry/i })).toBeInTheDocument();
  });

  test('renders the LoginPage component on /login when not authenticated', () => {
    navigateTo('/login');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });

  test('redirects to LoginPage when not authenticated and accessing /home', () => {
    navigateTo('/home');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });

  test('renders HomePage when authenticated and accessing /home', () => {
    // Simulate an authenticated state
    localStorage.setItem('authToken', 'mock-token');
    navigateTo('/home');
    render(<App />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument(); // Adjust based on HomePage content
  });

  test('renders the Tracks component on /tracks', () => {
    navigateTo('/tracks');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Tracks/i })).toBeInTheDocument();
  });

});
