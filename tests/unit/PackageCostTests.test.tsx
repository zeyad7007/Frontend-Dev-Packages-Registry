import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import PackageCost from '../../src/Components/PackageCost';
import { getPackageCost } from '../../src/api';
import '@testing-library/jest-dom';
import React from 'react';

// Mock getPackageCost API function
vi.mock('../../src/api', () => ({
  getPackageCost: vi.fn(),
}));

describe('PackageCost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input field, checkbox, button, and initial layout', () => {
    render(<PackageCost />);

    expect(screen.getByPlaceholderText('Enter Package ID')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Include Dependencies' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fetch Cost' })).toBeInTheDocument();
  });

  test('handles package ID input change', () => {
    render(<PackageCost />);

    const idInput = screen.getByPlaceholderText('Enter Package ID') as HTMLInputElement;
    fireEvent.change(idInput, { target: { value: '456' } });
    expect(idInput.value).toBe('456');
  });

  test('handles include dependencies checkbox change', () => {
    render(<PackageCost />);

    const checkbox = screen.getByRole('checkbox', { name: 'Include Dependencies' }) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('displays package cost details on successful fetch', async () => {
    // Mock a successful response
    (getPackageCost as Mock).mockResolvedValueOnce([
      {
        ID: '456',
        standalonecost: 200,
        totalcost: 500,
      },
    ]);

    render(<PackageCost />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Cost' }));

    await waitFor(() => {
      const costData = screen.getByText(/Package Cost Details:/);
      expect(costData).toBeInTheDocument();
      expect(screen.getByText('Standalone Cost:').parentElement);
      expect( screen.getByText('Total Cost:').parentElement);
    });
  });


  test('displays specific error message on Axios error with response data', async () => {
    // Mock an Axios error with specific error data
    (getPackageCost as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Package not found' },
      },
      message: 'Request failed with status code 404',
    });

    render(<PackageCost />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Cost' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 404: Package not found');
  });

  test('displays default error message on Axios error', async () => {
    // Mock an Axios error with specific error data
    (getPackageCost as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404
      }
    });

    render(<PackageCost />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Cost' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 404: undefined');
  });

  test('displays Axios error message if no error field in response data', async () => {
    // Mock an Axios error without specific error data
    (getPackageCost as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 500,
        data: {}, // Empty response data
      },
      message: 'Request failed with status code 500',
    });

    render(<PackageCost />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Cost' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Error 500: Request failed with status code 500');
  });

  test('displays generic error message for non-Axios errors', async () => {
    // Mock a non-Axios error
    (getPackageCost as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<PackageCost />);

    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Cost' }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('An unexpected error occurred.');
  });

  // test('does not attempt fetch without an ID', async () => {
  //   render(<PackageCost />);
  
  //   fireEvent.click(screen.getByRole('button', { name: 'Fetch Cost' }));
  
  //   expect(getPackageCost).not.toHaveBeenCalled();
  // });
});
