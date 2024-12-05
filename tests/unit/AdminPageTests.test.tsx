import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminActions from '../../src/Pages/AdminPage';
import '@testing-library/jest-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mocking components used in AdminActions
vi.mock('../../src/Components/UpdatePermissions', () => ({
  default: () => <div>Update Permissions Component</div>,
}));
vi.mock('../../src/Components/GetPermissions', () => ({
  default: () => <div>Get Permissions Component</div>,
}));
vi.mock('../../src/Components/RegisterUser', () => ({
  default: () => <div>Register User Component</div>,
}));
vi.mock('../../src/Components/CreateGroup', () => ({
  default: () => <div>Create Group Component</div>,
}));
vi.mock('../../src/Components/AssignUser', () => ({
  default: () => <div>Assign User to Group Component</div>,
}));
vi.mock('../../src/Components/AssignPackage', () => ({
  default: () => <div>Assign Package to Group Component</div>,
}));
vi.mock('../../src/Components/GetGroups', () => ({
  default: () => <div>Get Groups Component</div>,
}));
vi.mock('../../src/Components/GetUsersInGroup', () => ({
  default: () => <div>Get Group Users Component</div>,
}));
vi.mock('../../src/Components/GetHistory', () => ({
  default: () => <div>Get Package History Component</div>,
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminActions Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders heading, description, and navigation buttons', () => {
    render(
      <MemoryRouter>
        <AdminActions />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Admin Actions/i })).toBeInTheDocument();
    expect(screen.getByText(/Manage user permissions and other admin-related tasks./i)).toBeInTheDocument();

    const buttons = [
      /Update Permissions/i,
      /Get Permissions/i,
      /Register User/i,
      /Create Group/i,
      /Assign User to Group/i,
      /Assign Package to Group/i,
      /Get Groups/i,
      /Get Group Users/i,
      /Get Package History/i,
    ];

    buttons.forEach((buttonText) => {
      expect(screen.getByRole('link', { name: buttonText })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Back to Home/i })).toBeInTheDocument();
  });

  test('renders correct href for navigation links', () => {
    render(
      <MemoryRouter>
        <AdminActions />
      </MemoryRouter>
    );

    const links = [
      { name: /Update Permissions/i, href: '/update-permissions' },
      { name: /Get Permissions/i, href: '/get-permissions' },
      { name: /Register User/i, href: '/register-user' },
      { name: /Create Group/i, href: '/create-group' },
      { name: /Assign User to Group/i, href: '/assign-user' },
      { name: /Assign Package to Group/i, href: '/assign-package' },
      { name: /Get Groups/i, href: '/get-groups' },
      { name: /Get Group Users/i, href: '/get-users-in-group' },
      { name: /Get Package History/i, href: '/get-package-history' },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
    });
  });

  test('navigates to /home on clicking Back to Home button', () => {
    render(
      <MemoryRouter>
        <AdminActions />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Back to Home/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('renders the correct component for each route', () => {
    const routes = [
      { path: '/update-permissions', expectedText: 'Update Permissions Component' },
      { path: '/get-permissions', expectedText: 'Get Permissions Component' },
      { path: '/register-user', expectedText: 'Register User Component' },
      { path: '/create-group', expectedText: 'Create Group Component' },
      { path: '/assign-user', expectedText: 'Assign User to Group Component' },
      { path: '/assign-package', expectedText: 'Assign Package to Group Component' },
      { path: '/get-groups', expectedText: 'Get Groups Component' },
      { path: '/get-users-in-group', expectedText: 'Get Group Users Component' },
      { path: '/get-package-history', expectedText: 'Get Package History Component' },
    ];

    routes.forEach(({ path, expectedText }) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/*" element={<AdminActions />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});
