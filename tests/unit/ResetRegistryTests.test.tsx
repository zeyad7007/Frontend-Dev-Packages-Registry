import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, vi, beforeEach, Mock } from 'vitest';
import ResetRegistry from '../../src/Components/ResetRegistry';
import { resetRegistry } from '../../src/api';
import '@testing-library/jest-dom'; // for DOM matchers
import React from 'react';

// Mock resetRegistry function
vi.mock('../../src/api', () => ({
  resetRegistry: vi.fn(),
}));

describe('ResetRegistry Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders reset button correctly', () => {
    render(<ResetRegistry />);

    // Check if the reset button is rendered
    expect(screen.getByRole('button', { name: 'Reset Registry' })).toBeInTheDocument();
  });

  test('displays success message on successful reset', async () => {
    // Mock resetRegistry to resolve successfully
    (resetRegistry as Mock).mockResolvedValueOnce(undefined);

    render(<ResetRegistry />);

    // Act: simulate button click
    fireEvent.click(screen.getByRole('button', { name: 'Reset Registry' }));

    // Assert: check for success message
    await waitFor(() => {
      const successAlert = document.querySelector('.alert.alert-success') as HTMLElement;
      expect(successAlert).toBeInTheDocument();
      expect(successAlert.innerText).toBe('Registry has been reset successfully.');
    });
  });

  test('displays specific error message on Axios error with response data', async () => {
    // Mock resetRegistry to reject with an Axios error that includes response data
    (resetRegistry as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Invalid package data' },
      },
      message: 'Request failed with status code 404',
    });

    render(<ResetRegistry />);

    // Act: simulate button click
    fireEvent.click(screen.getByRole('button', { name: 'Reset Registry' }));

    // Assert: check for specific error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: Invalid package data');
  });

  test('displays Axios error message if no error field in response data', async () => {
    // Mock resetRegistry to reject with an Axios error that lacks specific error data
    (resetRegistry as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 500,
        data: {}, // Empty response data
      },
      message: 'Request failed with status code 500',
    });

    render(<ResetRegistry />);

    // Act: simulate button click
    fireEvent.click(screen.getByRole('button', { name: 'Reset Registry' }));

    // Assert: check for Axios default error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 500: Request failed with status code 500');
  });

  test('displays generic error message for non-Axios errors', async () => {
    // Mock resetRegistry to reject with a non-Axios error
    (resetRegistry as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<ResetRegistry />);

    // Act: simulate button click
    fireEvent.click(screen.getByRole('button', { name: 'Reset Registry' }));

    // Assert: check for generic error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred.');
    });
  });

  test('clears error message on successful reset after failure', async () => {
    // Mock resetRegistry to first fail, then succeed
    (resetRegistry as Mock)
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 500,
          data: { error: 'Server error' },
        },
        message: 'Request failed with status code 500',
      })
      .mockResolvedValueOnce(undefined);

    render(<ResetRegistry />);

    // First click to trigger failure
    fireEvent.click(screen.getByRole('button', { name: 'Reset Registry' }));
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 500: Server error');

    // Second click to trigger success and clear error
    fireEvent.click(screen.getByRole('button', { name: 'Reset Registry' }));
    await waitFor(() => {
      const successAlert = document.querySelector('.alert.alert-success') as HTMLElement;
      expect(successAlert).toBeInTheDocument();
      expect(successAlert.innerText).toBe('Registry has been reset successfully.');
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

});
