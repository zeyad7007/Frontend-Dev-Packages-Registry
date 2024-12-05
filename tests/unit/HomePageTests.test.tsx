import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../src/Pages/HomePage';
import '@testing-library/jest-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../src/Components/PackageList', () => ({
  default: () => <div>Package List Component</div>,
}));
vi.mock('../../src/Components/ResetRegistry', () => ({
  default: () => <div>Reset Registry Component</div>,
}));
vi.mock('../../src/Components/PackageDetails', () => ({
  default: () => <div>Package Details Component</div>,
}));
vi.mock('../../src/Components/UpdatePackage', () => ({
  default: () => <div>Update Package Component</div>,
}));
vi.mock('../../src/Components/UploadPackage', () => ({
  default: () => <div>Upload Package Component</div>,
}));
vi.mock('../../src/Components/PackageRating', () => ({
  default: () => <div>Package Rating Component</div>,
}));
vi.mock('../../src/Components/PackageCost', () => ({
  default: () => <div>Package Cost Component</div>,
}));
vi.mock('../../src/Components/SearchByRegex', () => ({
  default: () => <div>Search By Regex Component</div>,
}));
vi.mock('../../src/Components/Logout', () => ({
  default: ({ onLogout }: { onLogout: () => void }) => (
    <button onClick={onLogout} aria-label="Logout Button">
      Logout
    </button>
  ),
}));

const mockNavigate = vi.fn();

// Mock react-router-dom with specific `useNavigate` implementation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage Component', () => {
  const mockSetIsAuthenticated = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders heading, welcome message, and navigation buttons', () => {
    render(
      <MemoryRouter>
        <HomePage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Fuwwah Package Registry/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome! Use the options below to interact with the package registry./i)).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(8); // 8 navigation buttons
  });

  test('renders correct href for navigation links', () => {
    render(
      <MemoryRouter>
        <HomePage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    const links = [
      { name: /Get Packages/i, href: '/packages' },
      { name: /Reset Registry/i, href: '/reset' },
      { name: /Get Package by ID/i, href: '/package' },
      { name: /Update Package by ID/i, href: '/update-package' },
      { name: /Upload Package/i, href: '/upload' },
      { name: /Get Package Rating/i, href: '/package-rating' },
      { name: /Get Package Cost/i, href: '/package-cost' },
      { name: /Search by Regex/i, href: '/search' },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
    });
  });

  test('handles logout correctly', () => {
    render(
      <MemoryRouter>
        <HomePage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Logout Button'));

    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to admin actions on button click', () => {
    render(
      <MemoryRouter>
        <HomePage setIsAuthenticated={mockSetIsAuthenticated} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Admin Actions/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin-actions');
  });
});
