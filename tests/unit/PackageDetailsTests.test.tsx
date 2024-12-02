import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import PackageDetails from '../../src/Components/PackageDetails';
import { getPackageById } from '../../src/api';
import '@testing-library/jest-dom';
import React from 'react';

// Mock getPackageById API function
vi.mock('../../src/api', () => ({
  getPackageById: vi.fn(),
}));

describe('PackageDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input field, button, and initial layout', () => {
    render(<PackageDetails />);

    expect(screen.getByPlaceholderText('Enter Package ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fetch Package' })).toBeInTheDocument();
  });

  test('handles package ID input change', () => {
    render(<PackageDetails />);

    const idInput = screen.getByPlaceholderText('Enter Package ID') as HTMLInputElement;
    fireEvent.change(idInput, { target: { value: '123' } });
    expect(idInput.value).toBe('123');
  });

  test('displays package details on successful fetch', async () => {
    // Mock a successful response
    (getPackageById as Mock).mockResolvedValueOnce({
      metadata: { Name: 'TestPackage', Version: '1.0.0', ID: '123' },
      data: { URL: 'https://example.com', JSProgram: 'console.log("Hello World");' },
    });

    render(<PackageDetails />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Package' }));

    await waitFor(() => {
      expect(screen.getByText('TestPackage (v1.0.0)')).toBeInTheDocument();
      expect(screen.getByText('ID: 123')).toBeInTheDocument();
      expect(screen.getByText('URL:')).toBeInTheDocument();
      expect(screen.getByText('JavaScript Program:')).toBeInTheDocument();
      expect(screen.getByText('console.log("Hello World");')).toBeInTheDocument();
    });
  });

  test('displays specific error message on Axios error with response data', async () => {
    // Mock an Axios error with specific error data
    (getPackageById as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Package not found' },
      },
      message: 'Request failed with status code 404',
    });

    render(<PackageDetails />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Package' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 404: Package not found');
  });

  test('displays default error message on Axios error', async () => {
    // Mock an Axios error with specific error data
    (getPackageById as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
      },
    });

    render(<PackageDetails />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Package' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 404: undefined');
  });

  test('displays Axios error message if no error field in response data', async () => {
    // Mock an Axios error without specific error data
    (getPackageById as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 500,
        data: {}, // Empty response data
      },
      message: 'Request failed with status code 500',
    });

    render(<PackageDetails />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Package' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 500: Request failed with status code 500');
  });

  test('displays generic error message for non-Axios errors', async () => {
    // Mock a non-Axios error
    (getPackageById as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<PackageDetails />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Package' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('An unexpected error occurred.');
  });
  
});
