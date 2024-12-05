import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import AssignUserToGroup from '../../src/Components/AssignUser';
import { assignUserToGroup } from '../../src/api';

// Mock the API module
vi.mock('../../src/api', () => ({
  assignUserToGroup: vi.fn(),
}));

describe('AssignUserToGroup Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders all inputs, button, and headings', () => {
    render(<AssignUserToGroup />);

    expect(screen.getByRole('heading', { name: /Assign User to Group/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/User ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Assign User to Group/i })).toBeInTheDocument();
  });

  test('shows validation error when inputs are empty', () => {
    render(<AssignUserToGroup />);

    const assignButton = screen.getByRole('button', { name: /Assign User to Group/i });
    fireEvent.click(assignButton);

    expect(screen.getByRole('alert')).toHaveTextContent('Both User ID and Group ID are required.');
  });

  test('calls assignUserToGroup API with correct data', async () => {
    const mockResponseMessage = 'User successfully assigned to the group.';
    (assignUserToGroup as Mock).mockResolvedValueOnce(mockResponseMessage);

    render(<AssignUserToGroup />);

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '456' } });

    const assignButton = screen.getByRole('button', { name: /Assign User to Group/i });
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(assignUserToGroup).toHaveBeenCalledWith({ userId: 123 }, 456);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(mockResponseMessage);
    });
  });


  test('displays error message on API error (validation error)', async () => {
    (assignUserToGroup as Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: 'Invalid user ID or group ID.' },
      },
    });

    render(<AssignUserToGroup />);

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });

    const assignButton = screen.getByRole('button', { name: /Assign User to Group/i });
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error 400: Invalid user ID or group ID.');
    });
  });

  test('displays error message on API error (unexpected)', async () => {
    (assignUserToGroup as Mock).mockRejectedValue({
      isAxiosError: false,
    });

    render(<AssignUserToGroup />);

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '456' } });

    const assignButton = screen.getByRole('button', { name: /Assign User to Group/i });
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred.');
    });
  });

  test('clears success and error messages on new request', async () => {
    (assignUserToGroup as Mock).mockResolvedValueOnce('User successfully assigned to the group.');

    render(<AssignUserToGroup />);

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '456' } });

    const assignButton = screen.getByRole('button', { name: /Assign User to Group/i });
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User successfully assigned to the group.');
    });

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: '789' } });
    fireEvent.click(assignButton);

    expect(screen.queryByText('User successfully assigned to the group.')).not.toBeInTheDocument();
  });

  test('displays default axios error message on API error', async () => {
    (assignUserToGroup as Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 404
      },
    });

    render(<AssignUserToGroup />);

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });

    const assignButton = screen.getByRole('button', { name: /Assign User to Group/i });
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error 404: undefined');
    });
  });
});
