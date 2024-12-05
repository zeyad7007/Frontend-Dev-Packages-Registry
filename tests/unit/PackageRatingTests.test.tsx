import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { describe, expect, vi, beforeEach, Mock } from 'vitest';
import PackageRating from '../../src/Components/PackageRating';
import { getPackageRating } from '../../src/api';
import '@testing-library/jest-dom';
import React from 'react';

// Mock getPackageRating function
vi.mock('../../src/api', () => ({
  getPackageRating: vi.fn(),
}));

describe('PackageRating Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input and button', () => {
    render(<PackageRating />);

    // Check if input and button are rendered
    expect(screen.getByPlaceholderText('Enter Package ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fetch Rating' })).toBeInTheDocument();
  });

  test('handles package ID input change', () => {
    render(<PackageRating />);

    const packageIdInput = screen.getByPlaceholderText('Enter Package ID') as HTMLInputElement;
    fireEvent.change(packageIdInput, { target: { value: '12345' } });
    expect(packageIdInput.value).toBe('12345');
  });

  test('displays rating details on successful fetch', async () => {
    // Mock successful response with complete rating data
    (getPackageRating as Mock).mockResolvedValueOnce({
      BusFactor: 0.9,
      BusFactorLatency: 100,
      Correctness: 0.8,
      CorrectnessLatency: 120,
      RampUp: 0.7,
      RampUpLatency: 130,
      Responsiveness: 0.6,
      ResponsivenessLatency: 140,
      LicenseScore: 1.0,
      LicenseScoreLatency: 150,
      GoodPinningPractice: 0.5,
      GoodPinningPracticeLatency: 160,
      PullRequest: 0.4,
      PullRequestLatency: 170,
      NetScore: 0.85,
      NetScoreLatency: 180,
    });
  
    render(<PackageRating />);
  
    // Set package ID input and trigger fetch
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Rating' }));
  
    // Assert: check that rating details are displayed
    await waitFor(() => {
      expect(screen.getByText('Package Rating Details:')).toBeInTheDocument();
  
      // Verify each rating and its latency
      expect(screen.getByText(/Bus Factor/i).parentElement).toHaveTextContent('Score: 0.9');
      expect(screen.getByText(/Bus Factor/i).parentElement).toHaveTextContent('Latency: 100ms');
  
      expect(screen.getByText(/Correctness/i).parentElement).toHaveTextContent('Score: 0.8');
      expect(screen.getByText(/Correctness/i).parentElement).toHaveTextContent('Latency: 120ms');
  
      expect(screen.getByText(/Ramp Up/i).parentElement).toHaveTextContent('Score: 0.7');
      expect(screen.getByText(/Ramp Up/i).parentElement).toHaveTextContent('Latency: 130ms');
  
      expect(screen.getByText(/Responsiveness/i).parentElement).toHaveTextContent('Score: 0.6');
      expect(screen.getByText(/Responsiveness/i).parentElement).toHaveTextContent('Latency: 140ms');
  
      expect(screen.getByText(/License Score/i).parentElement).toHaveTextContent('Score: 1');
      expect(screen.getByText(/License Score/i).parentElement).toHaveTextContent('Latency: 150ms');
  
      expect(screen.getByText(/Good Pinning Practice/i).parentElement).toHaveTextContent('Score: 0.5');
      expect(screen.getByText(/Good Pinning Practice/i).parentElement).toHaveTextContent('Latency: 160ms');
  
      expect(screen.getByText(/Pull Request/i).parentElement).toHaveTextContent('Score: 0.4');
      expect(screen.getByText(/Pull Request/i).parentElement).toHaveTextContent('Latency: 170ms');
  
      expect(screen.getByText(/Net Score/i).parentElement).toHaveTextContent('Score: 0.85');
      expect(screen.getByText(/Net Score/i).parentElement).toHaveTextContent('Latency: 180ms');
    });
  });
  


  test('displays specific error message on Axios error with response data', async () => {
    // Mock getPackageRating to reject with an Axios error with specific error data
    (getPackageRating as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Package not found' },
      },
      message: 'Request failed with status code 404',
    });

    render(<PackageRating />);

    // Set package ID input and trigger fetch
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Rating' }));

    // Assert: check for specific error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: Package not found');
  });

  test('displays Axios error message if no error field in response data', async () => {
    // Mock getPackageRating to reject with an Axios error without specific error data
    (getPackageRating as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 500,
        data: {}, // Empty response data
      },
      message: 'Request failed with status code 500',
    });

    render(<PackageRating />);

    // Set package ID input and trigger fetch
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Rating' }));

    // Assert: check for Axios default error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 500: Request failed with status code 500');
  });

  test('displays generic error message for non-Axios errors', async () => {
    // Mock getPackageRating to reject with a non-Axios error
    (getPackageRating as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<PackageRating />);

    // Set package ID input and trigger fetch
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Rating' }));

    // Assert: check for generic error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred.');
    });
  });

  test('displays default error message on Axios error', async () => {
    // Mock getPackageRating to reject with an Axios error with specific error data
    (getPackageRating as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
      }
    });

    render(<PackageRating />);

    // Set package ID input and trigger fetch
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Rating' }));

    // Assert: check for specific error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: undefined');
  });
});
