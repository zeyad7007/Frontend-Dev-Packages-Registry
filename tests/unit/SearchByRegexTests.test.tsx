import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, vi, beforeEach, Mock } from 'vitest';
import SearchByRegex from '../../src/Components/SearchByRegex';
import { getPackagesByRegex } from '../../src/api';
import '@testing-library/jest-dom'; // for DOM matchers
import React from 'react';

// Mock getPackagesByRegex function
vi.mock('../../src/api', () => ({
  getPackagesByRegex: vi.fn(),
}));

describe('SearchByRegex Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders search input and button', () => {
    render(<SearchByRegex />);

    // Check if input and button are rendered
    expect(screen.getByPlaceholderText('Enter Regex')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('handles regex input change', () => {
    render(<SearchByRegex />);

    const regexInput = screen.getByPlaceholderText('Enter Regex') as HTMLInputElement;
    fireEvent.change(regexInput, { target: { value: 'test.*' } });
    expect(regexInput.value).toBe('test.*');
  });

  test('displays packages on successful search', async () => {
    // Mock successful response with some package data
    (getPackagesByRegex as Mock).mockResolvedValueOnce([
      { metadata: { ID: '1', Name: 'Test Package 1', Version: '1.0' } },
      { metadata: { ID: '2', Name: 'Test Package 2', Version: '2.0' } },
    ]);

    render(<SearchByRegex />);

    // Set regex input and trigger search
    fireEvent.change(screen.getByPlaceholderText('Enter Regex'), {
      target: { value: 'test.*' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // Assert: check that package data is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Package 1')).toBeInTheDocument();
      expect(screen.getByText('Version: 1.0')).toBeInTheDocument();
      expect(screen.getByText('Test Package 2')).toBeInTheDocument();
      expect(screen.getByText('Version: 2.0')).toBeInTheDocument();
    });
  });

//   test('displays "No packages found" when no results match the regex', async () => {
//     // Mock successful response with an empty array (no matching packages)
//     (getPackagesByRegex as Mock).mockResolvedValueOnce([]);

//     render(<SearchByRegex />);

//     // Set regex input and trigger search
//     fireEvent.change(screen.getByPlaceholderText('Enter Regex'), {
//       target: { value: 'nonexistent.*' },
//     });
//     fireEvent.click(screen.getByRole('button', { name: 'Search' }));

//     // Assert: check that "No packages found" message is displayed
//     await waitFor(() => {
//       expect(screen.getByText('No package found')).toBeInTheDocument();
//     });
//   });

  test('displays specific error message on Axios error with response data', async () => {
    // Mock getPackagesByRegex to reject with an Axios error that includes response data
    (getPackagesByRegex as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'No packages found for the given regex' },
      },
      message: 'Request failed with status code 404',
    });

    render(<SearchByRegex />);

    // Set regex input and trigger search
    fireEvent.change(screen.getByPlaceholderText('Enter Regex'), {
      target: { value: 'test.*' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // Assert: check for specific error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: No packages found for the given regex');
  });

  test('displays Axios error message if no error field in response data', async () => {
    // Mock getPackagesByRegex to reject with an Axios error without specific error data
    (getPackagesByRegex as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 500,
        data: {}, // Empty response data
      },
      message: 'Request failed with status code 500',
    });

    render(<SearchByRegex />);

    // Set regex input and trigger search
    fireEvent.change(screen.getByPlaceholderText('Enter Regex'), {
      target: { value: 'test.*' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // Assert: check for Axios default error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 500: Request failed with status code 500');
  });

  test('displays generic error message for non-Axios errors', async () => {
    // Mock getPackagesByRegex to reject with a non-Axios error
    (getPackagesByRegex as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<SearchByRegex />);

    // Set regex input and trigger search
    fireEvent.change(screen.getByPlaceholderText('Enter Regex'), {
      target: { value: 'test.*' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // Assert: check for generic error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred.');
    });
  });
});
