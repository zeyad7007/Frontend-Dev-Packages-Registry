import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';



describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the main heading', () => {
    const heading = screen.getByRole('heading', { name: /Fuwwah Package Registry/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders all navigation buttons', () => {
    const buttons = [
      'Get Packages',
      'Reset Registry',
      'Get Package by ID',
      'Update Package by ID',
      'Upload Package',
      'Get Package Rating',
      'Get Package Cost',
      'Search by Regex',
      'Get Tracks',
    ];
    
    buttons.forEach((buttonText) => {
      const button = screen.getByRole('link', { name: buttonText });
      expect(button).toBeInTheDocument();
    });
  });

  it('renders the PackageList component on /packages route', () => {
    window.history.pushState({}, 'Test page', '/packages');
    render(<App />);
    expect(screen.getByText(/Package List/i)).toBeInTheDocument();
  });

  it('renders the ResetRegistry component on /reset route', () => {
    window.history.pushState({}, 'Test page', '/reset');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Reset Registry/i })).toBeInTheDocument();
  });

  it('renders the PackageDetails component on /package route', () => {
    window.history.pushState({}, 'Test page', '/package');
    render(<App />);
    expect(screen.getByText(/Package Details/i)).toBeInTheDocument();
  });

  it('renders the UpdatePackage component on /update-package route', () => {
    window.history.pushState({}, 'Test page', '/update-package');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Update Package/i })).toBeInTheDocument();
  });

  it('renders the UploadPackage component on /upload route', () => {
    window.history.pushState({}, 'Test page', '/upload');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Upload Package/i })).toBeInTheDocument();
  });

  it('renders the PackageRating component on /package-rating route', () => {
    window.history.pushState({}, 'Test page', '/package-rating');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Package Rating/i })).toBeInTheDocument();
  });

  it('renders the PackageCost component on /package-cost route', () => {
    window.history.pushState({}, 'Test page', '/package-cost');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Package Cost/i })).toBeInTheDocument();
  });

  it('renders the SearchByRegex component on /search route', () => {
    window.history.pushState({}, 'Test page', '/search');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Search Packages by Regex/i })).toBeInTheDocument();
  });

  it('renders the Tracks component on /tracks route', () => {
    window.history.pushState({}, 'Test page', '/tracks');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Tracks/i })).toBeInTheDocument();
  });
});
