import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import PackageList from '../../src/Components/PackageList';
import { getPackages } from '../../src/api';
import '@testing-library/jest-dom';
import React from 'react';

// Mock getPackages API function
vi.mock('../../src/api', () => ({
  getPackages: vi.fn(),
}));

describe('PackageList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input fields, buttons, and initial query field', () => {
    render(<PackageList />);

    expect(screen.getByPlaceholderText('Enter Offset')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Package Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Version')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load Packages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Another Query' })).toBeInTheDocument();
  });

  test('handles offset input change', () => {
    render(<PackageList />);

    const offsetInput = screen.getByPlaceholderText('Enter Offset') as HTMLInputElement;
    fireEvent.change(offsetInput, { target: { value: '5' } });
    expect(offsetInput.value).toBe('5');
  });

  test('handles query input change and adds/removes query fields', () => {
    render(<PackageList />);

    const nameInput = screen.getByPlaceholderText('Enter Package Name') as HTMLInputElement;
    const versionInput = screen.getByPlaceholderText('Enter Version') as HTMLInputElement;

    // Update query fields
    fireEvent.change(nameInput, { target: { value: 'TestPackage' } });
    fireEvent.change(versionInput, { target: { value: '1.0.0' } });
    expect(nameInput.value).toBe('TestPackage');
    expect(versionInput.value).toBe('1.0.0');

    // Add a new query field
    fireEvent.click(screen.getByRole('button', { name: 'Add Another Query' }));
    const allNameInputs = screen.getAllByPlaceholderText('Enter Package Name');
    expect(allNameInputs.length).toBe(2);

    // Remove the added query field
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[1]);
    expect(screen.getAllByPlaceholderText('Enter Package Name').length).toBe(1);
  });

  test('displays packages on successful fetch', async () => {
    // Mock a successful response
    (getPackages as Mock).mockResolvedValueOnce([
      { id: '1', name: 'TestPackage', version: '1.0.0' },
      { id: '2', name: 'SamplePackage', version: '2.1.0' },
    ]);

    render(<PackageList />);

    fireEvent.change(screen.getByPlaceholderText('Enter Offset'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Packages' }));

    await waitFor(() => {
      expect(screen.getByText('TestPackage')).toBeInTheDocument();
      expect(screen.getByText('SamplePackage')).toBeInTheDocument();
      expect(screen.getByText('Version: 1.0.0')).toBeInTheDocument();
      expect(screen.getByText('Version: 2.1.0')).toBeInTheDocument();
    });
  });

  test('shows error for invalid offset input', async () => {
    render(<PackageList />);

    fireEvent.change(screen.getByPlaceholderText('Enter Offset'), { target: { value: '-5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Packages' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Offset must be a non-negative number.');
  });

  test('displays specific error message on Axios error with response data', async () => {
    // Mock an Axios error with specific error data
    (getPackages as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Packages not found' },
      },
      message: 'Request failed with status code 404',
    });

    render(<PackageList />);

    fireEvent.change(screen.getByPlaceholderText('Enter Offset'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Packages' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 404: Packages not found');
  });

  test('displays default error message on Axios error', async () => {
    // Mock an Axios error with specific error data
    (getPackages as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404
      }
    });

    render(<PackageList />);

    fireEvent.change(screen.getByPlaceholderText('Enter Offset'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Packages' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 404: undefined');
  });

  test('displays Axios error message if no error field in response data', async () => {
    // Mock an Axios error without specific error data
    (getPackages as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 500,
        data: {}, // Empty response data
      },
      message: 'Request failed with status code 500',
    });

    render(<PackageList />);

    fireEvent.change(screen.getByPlaceholderText('Enter Offset'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Packages' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 500: Request failed with status code 500');
  });

  test('displays generic error message for non-Axios errors', async () => {
    // Mock a non-Axios error
    (getPackages as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<PackageList />);

    fireEvent.change(screen.getByPlaceholderText('Enter Offset'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load Packages' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('An unexpected error occurred.');
  });
});
