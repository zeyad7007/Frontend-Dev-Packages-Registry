import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import '@testing-library/jest-dom';
import GetUsersInGroup from '../../src/Components/GetUsersInGroup'; // Adjust the import path
import { getUsersInGroup } from '../../src/api'; // Mock the API call

// Mock the API
vi.mock('../../src/api', () => ({
  getUsersInGroup: vi.fn(),
}));

describe('GetUsersInGroup Component', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
  });

  test('renders input field, button, and initial state', () => {
    render(<GetUsersInGroup />);
    
    // Assert input field and button are rendered
    expect(screen.getByLabelText(/Group ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch Users/i })).toBeInTheDocument();

    // Assert no messages or users displayed initially
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/Users in Group/i)).not.toBeInTheDocument();
  });

  test('displays an error when the group ID is empty', async () => {
    render(<GetUsersInGroup />);

    // Click the fetch button without entering a group ID
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Assert the error message
    expect(await screen.findByRole('alert')).toHaveTextContent('Group ID is required.');
  });

  test('displays an error when the group ID is not a valid number', async () => {
    render(<GetUsersInGroup />);

    // Enter an invalid group ID
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Assert the error message
    expect(await screen.findByRole('alert')).toHaveTextContent('Group ID must be a valid number.');
  });

  test('fetches and displays users when API returns a successful response', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    (getUsersInGroup as Mock).mockResolvedValueOnce(mockUsers);

    render(<GetUsersInGroup />);

    // Enter a valid group ID and click fetch
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Wait for users to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Users in Group:/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });

    // Assert the success message
    expect(screen.getByRole('alert')).toHaveTextContent('Successfully fetched users in the group.');
  });

  test('displays "No users found" when API returns an empty array', async () => {
    (getUsersInGroup as Mock).mockResolvedValueOnce([]);

    render(<GetUsersInGroup />);

    // Enter a valid group ID and click fetch
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Assert "No users found" message
    expect(await screen.findByText(/No users found in this group./i)).toBeInTheDocument();
  });

  test('displays an error when the API call fails with an Axios error', async () => {
    (getUsersInGroup as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Group not found' },
      },
    });

    render(<GetUsersInGroup />);

    // Enter a valid group ID and click fetch
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Assert the error message
    expect(await screen.findByRole('alert')).toHaveTextContent('Error 404: Group not found');
  });

  test('displays a generic error when the API call fails with a non-Axios error', async () => {
    (getUsersInGroup as Mock).mockRejectedValueOnce(new Error('Unexpected error'));

    render(<GetUsersInGroup />);

    // Enter a valid group ID and click fetch
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Assert the error message
    expect(await screen.findByRole('alert')).toHaveTextContent('An unexpected error occurred.');
  });

  test('displays default error when the API call fails', async () => {
    (getUsersInGroup as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404
      },
    });

    render(<GetUsersInGroup />);

    // Enter a valid group ID and click fetch
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Fetch Users/i }));

    // Assert the error message
    expect(await screen.findByRole('alert')).toHaveTextContent('Error 404: undefined');
  });

});
