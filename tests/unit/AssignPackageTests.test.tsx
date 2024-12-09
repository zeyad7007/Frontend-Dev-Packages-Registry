import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import AssignPackageToGroup from '../../src/Components/AssignPackage';
import { assignPackageToGroup } from '../../src/api';

// Mock the API module
vi.mock('../../src/api', () => ({
  assignPackageToGroup: vi.fn(),
}));

describe('AssignPackageToGroup Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders input fields and submit button', () => {
    render(<AssignPackageToGroup />);
    expect(screen.getByLabelText(/Package ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Assign Package to Group/i })).toBeInTheDocument();
  });

  test('displays error if inputs are empty', () => {
    render(<AssignPackageToGroup />);
    const assignButton = screen.getByRole('button', { name: /Assign Package to Group/i });

    fireEvent.click(assignButton);

    expect(screen.getByText(/Both Group ID and Package ID are required/i)).toBeInTheDocument();
  });

 

  test('displays error message when API call fails with Axios error', async () => {
    (assignPackageToGroup as Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: 'Invalid group ID' },
      },
    });

    render(<AssignPackageToGroup />);

    fireEvent.change(screen.getByLabelText(/Package ID/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '999' } });

    fireEvent.click(screen.getByRole('button', { name: /Assign Package to Group/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error 400: Invalid group ID/i)).toBeInTheDocument();
    });
  });

  test('displays generic error message on unexpected error', async () => {
    (assignPackageToGroup as Mock).mockRejectedValue(new Error('Unexpected server error'));

    render(<AssignPackageToGroup />);

    fireEvent.change(screen.getByLabelText(/Package ID/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '202' } });

    fireEvent.click(screen.getByRole('button', { name: /Assign Package to Group/i }));

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  test('displays success message and clears error on successful assignment', async () => {
    (assignPackageToGroup as Mock).mockResolvedValue('Package successfully assigned to group');

    render(<AssignPackageToGroup />);

    fireEvent.change(screen.getByLabelText(/Package ID/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '202' } });

    fireEvent.click(screen.getByRole('button', { name: /Assign Package to Group/i }));

    await waitFor(() => {
      expect(screen.getByText(/Package successfully assigned to group/i)).toBeInTheDocument();
      expect(screen.queryByText(/Both Group ID and Package ID are required/i)).not.toBeInTheDocument();
    });
  });

  test('displays axios default error message when API call fails', async () => {
    (assignPackageToGroup as Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400
      },
    });

    render(<AssignPackageToGroup />);

    fireEvent.change(screen.getByLabelText(/Package ID/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '999' } });

    fireEvent.click(screen.getByRole('button', { name: /Assign Package to Group/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error 400: undefined/i)).toBeInTheDocument();
    });
  });
});
