import { render, screen, fireEvent, waitFor,within } from '@testing-library/react';
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
    // Mock successful response with rating data
    (getPackageRating as Mock).mockResolvedValueOnce({
      BusFactor: 0.9,
      Correctness: 0.8,
      RampUp: 0.7,
      Responsiveness: 0.6,
      LicenseScore: 1.0,
      GoodPinningPractice: 0.5,
      PullRequest: 0.4,
      NetScore: 0.85,
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
  
      const busFactorElement = screen.getByText('Bus Factor:').parentElement;
      expect(within(busFactorElement as HTMLElement).getByText('0.9')).toBeInTheDocument();
  
      const correctnessElement = screen.getByText('Correctness:').parentElement;
      expect(within(correctnessElement as HTMLElement).getByText('0.8')).toBeInTheDocument();
  
      const rampUpElement = screen.getByText('Ramp Up:').parentElement;
      expect(within(rampUpElement as HTMLElement).getByText('0.7')).toBeInTheDocument();
  
      const responsivenessElement = screen.getByText('Responsiveness:').parentElement;
      expect(within(responsivenessElement as HTMLElement).getByText('0.6')).toBeInTheDocument();
  
      const licenseScoreElement = screen.getByText('License Score:').parentElement;
      expect(within(licenseScoreElement as HTMLElement).getByText('1')).toBeInTheDocument();
  
      const goodPinningPracticeElement = screen.getByText('Good Pinning Practice:').parentElement;
      expect(within(goodPinningPracticeElement as HTMLElement).getByText('0.5')).toBeInTheDocument();
  
      const pullRequestElement = screen.getByText('Pull Request:').parentElement;
      expect(within(pullRequestElement as HTMLElement).getByText('0.4')).toBeInTheDocument();
  
      const netScoreElement = screen.getByText('Net Score:').parentElement;
      expect(within(netScoreElement as HTMLElement).getByText('0.85')).toBeInTheDocument();
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
});
