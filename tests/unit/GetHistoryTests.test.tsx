import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import GetPackageHistory from '../../src/Components/GetHistory';
import { getHistory } from '../../src/api';

// Mock the API module
vi.mock('../../src/api', () => ({
  getHistory: vi.fn(),
}));

describe('GetPackageHistory Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders the input field, button, and initial state', () => {
    render(<GetPackageHistory />);
    expect(screen.getByPlaceholderText('Enter Package ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch History/i })).toBeInTheDocument();
    expect(screen.queryByText(/Package history fetched successfully/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('shows error message when invalid package ID is entered', async () => {
    render(<GetPackageHistory />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: 'invalid-id' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch History/i }));

    await waitFor(() => {
      expect(screen.getByText('Package ID must be a valid number.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  test('fetches and displays package history on valid input', async () => {
    const mockResponse = [
      {
        id: 1,
        package_id: 101,
        user_id: 1001,
        action: 'Updated',
        action_date: '2023-11-01T10:30:00Z',
      },
      {
        id: 2,
        package_id: 101,
        user_id: 1002,
        action: 'Deleted',
        action_date: '2023-11-02T15:00:00Z',
      },
    ];

    (getHistory as Mock).mockResolvedValueOnce(mockResponse);

    render(<GetPackageHistory />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '101' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch History/i }));

    await waitFor(() => {
      expect(screen.getByText('Package history fetched successfully.')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.getByText('Deleted')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    (getHistory as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404, data: { error: 'Package not found' } },
    });

    render(<GetPackageHistory />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch History/i }));

    await waitFor(() => {
      expect(screen.getByText('Error 404: Package not found')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  test('displays generic error message on unexpected error', async () => {
    (getHistory as Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<GetPackageHistory />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '101' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch History/i }));

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  test('displays default error message on API failure', async () => {
    (getHistory as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404}
    });

    render(<GetPackageHistory />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Fetch History/i }));

    await waitFor(() => {
      expect(screen.getByText('Error 404: undefined')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });
});
