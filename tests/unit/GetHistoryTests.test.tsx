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
