import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import GetUserPermissions from '../../src/Components/GetPermissions';
import { getPermissions } from '../../src/api';

// Mock the API module
vi.mock('../../src/api', () => ({
  getPermissions: vi.fn(),
}));

describe('GetUserPermissions Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders input field, button, and initial state', () => {
    render(<GetUserPermissions />);

    expect(screen.getByPlaceholderText('Enter User ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch Permissions/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/User Permissions:/i)).not.toBeInTheDocument();
  });

  test('shows error message when input is empty', async () => {
    render(<GetUserPermissions />);

    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.getByText('User ID is required.')).toBeInTheDocument();
      expect(screen.queryByText(/User Permissions:/i)).not.toBeInTheDocument();
    });
  });

  test('fetches and displays permissions on valid input', async () => {
    const mockResponse = {
      can_download: true,
      can_search: true,
      can_upload: false,
    };
  
    (getPermissions as Mock).mockResolvedValueOnce(mockResponse);
  
    render(<GetUserPermissions />);
  
    // Enter a valid user ID and trigger the fetch
    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));
  
    // Wait for the permissions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Successfully fetched user permissions.')).toBeInTheDocument();
      expect(screen.getByText('User Permissions:')).toBeInTheDocument();
    });
  
    // Assert permissions with more flexible matching
    const downloadPermission = screen.getByText(/Can Download:/i).closest('li');
    const searchPermission = screen.getByText(/Can Search:/i).closest('li');
    const uploadPermission = screen.getByText(/Can Upload:/i).closest('li');
  
    expect(downloadPermission).toHaveTextContent('Can Download: Yes');
    expect(searchPermission).toHaveTextContent('Can Search: Yes');
    expect(uploadPermission).toHaveTextContent('Can Upload: No');
  });
  

  test('handles API error with specific error message', async () => {
    (getPermissions as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404, data: { error: 'User not found' } },
    });

    render(<GetUserPermissions />);

    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.getByText('Error 404: User not found')).toBeInTheDocument();
      expect(screen.queryByText(/User Permissions:/i)).not.toBeInTheDocument();
    });
  });

  test('handles API error with generic message', async () => {
    (getPermissions as Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<GetUserPermissions />);

    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
      expect(screen.queryByText(/User Permissions:/i)).not.toBeInTheDocument();
    });
  });

  test('displays no permissions message when API response is empty', async () => {
    (getPermissions as Mock).mockResolvedValueOnce(null);

    render(<GetUserPermissions />);

    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.getByText('Successfully fetched user permissions.')).toBeInTheDocument();
      expect(screen.queryByText(/User Permissions:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Can Download:/i)).not.toBeInTheDocument();
    });
  });

  test('clears error and permissions on new valid input', async () => {
    const mockResponse = {
      can_download: true,
      can_search: false,
      can_upload: true,
    };

    (getPermissions as Mock).mockResolvedValueOnce(mockResponse);

    render(<GetUserPermissions />);

    // Trigger an error first
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.getByText('User ID is required.')).toBeInTheDocument();
    });

    // Enter valid input
    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.queryByText('User ID is required.')).not.toBeInTheDocument();
      expect(screen.getByText('Successfully fetched user permissions.')).toBeInTheDocument();
      expect(screen.getByText('User Permissions:')).toBeInTheDocument();
    });
  });

  test('Shows default error message on erronous API call', async () => {
    (getPermissions as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 }
    });

    render(<GetUserPermissions />);

    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));

    await waitFor(() => {
      expect(screen.getByText('Error 404: undefined')).toBeInTheDocument();
      expect(screen.queryByText(/User Permissions:/i)).not.toBeInTheDocument();
    });
  });

  test('sets permissions from the first element if response is an array', async () => {
    // Mock API response as an array with a single permissions object
    const mockResponse = [
      {
        can_download: true,
        can_search: true,
        can_upload: false,
      },
    ];
  
    (getPermissions as Mock).mockResolvedValueOnce(mockResponse);
  
    render(<GetUserPermissions />);
  
    // Enter a valid user ID and trigger the fetch
    fireEvent.change(screen.getByPlaceholderText('Enter User ID'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Permissions/i }));
  
    // Wait for the permissions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Successfully fetched user permissions.')).toBeInTheDocument();
      expect(screen.getByText('User Permissions:')).toBeInTheDocument();
    });
  
    // Assert that the first element's permissions are displayed
    const downloadPermission = screen.getByText(/Can Download:/i).closest('li');
    const searchPermission = screen.getByText(/Can Search:/i).closest('li');
    const uploadPermission = screen.getByText(/Can Upload:/i).closest('li');
  
    expect(downloadPermission).toHaveTextContent('Can Download: Yes');
    expect(searchPermission).toHaveTextContent('Can Search: Yes');
    expect(uploadPermission).toHaveTextContent('Can Upload: No');
  });
  
  
});
