import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import CreateGroup from '../../src/Components/CreateGroup';
import { createGroup } from '../../src/api';

vi.mock('../../src/api', () => ({
  createGroup: vi.fn(), // Mock the createGroup API function
}));

describe('CreateGroup Component', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset all mocks before each test
  });

  test('renders the component with input and button', () => {
    render(<CreateGroup />);

    // Check for heading
    expect(
      screen.getByRole('heading', { name: /Create a New Group/i })
    ).toBeInTheDocument();

    // Check for input field
    expect(screen.getByPlaceholderText(/Enter Group Name/i)).toBeInTheDocument();

    // Check for button
    expect(screen.getByRole('button', { name: /Create Group/i })).toBeInTheDocument();
  });

  test('shows error message when trying to create a group without a name', async () => {
    render(<CreateGroup />);

    // Simulate button click without entering a group name
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Group name is required/i)).toBeInTheDocument();
    });
  });

  test('calls the createGroup API with correct data and displays success message', async () => {
    (createGroup as Mock).mockResolvedValueOnce('1234'); // Mock successful response

    render(<CreateGroup />);

    // Enter group name
    fireEvent.change(screen.getByPlaceholderText(/Enter Group Name/i), {
      target: { value: 'Test Group' },
    });

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Wait for API call and success message
    await waitFor(() => {
      expect(createGroup).toHaveBeenCalledWith({ name: 'Test Group' });
      expect(
        screen.getByText(/Group created successfully with ID: 1234/i)
      ).toBeInTheDocument();
    });
  });

  test('displays error message on API failure (AxiosError)', async () => {
    (createGroup as Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: 'Invalid group name' },
      },
    });

    render(<CreateGroup />);

    // Enter group name
    fireEvent.change(screen.getByPlaceholderText(/Enter Group Name/i), {
      target: { value: 'Invalid Group' },
    });

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Error 400: Invalid group name/i)
      ).toBeInTheDocument();
    });
  });

  test('displays generic error message on unexpected API failure', async () => {
    (createGroup as Mock).mockRejectedValue(new Error('Unexpected error'));

    render(<CreateGroup />);

    // Enter group name
    fireEvent.change(screen.getByPlaceholderText(/Enter Group Name/i), {
      target: { value: 'Test Group' },
    });

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Wait for generic error message
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred/i)
      ).toBeInTheDocument();
    });
  });

  test('clears previous messages when starting a new group creation', async () => {
    render(<CreateGroup />);

    // Simulate entering invalid data
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Group name is required/i)).toBeInTheDocument();
    });

    // Enter valid group name and click the button
    fireEvent.change(screen.getByPlaceholderText(/Enter Group Name/i), {
      target: { value: 'Valid Group' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Ensure error message is cleared
    await waitFor(() => {
      expect(
        screen.queryByText(/Group name is required/i)
      ).not.toBeInTheDocument();
    });
  });

  test('handles empty inputs and prevents API call', async () => {
    render(<CreateGroup />);

    // Click the button without entering any input
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Ensure the API is not called
    await waitFor(() => {
      expect(createGroup).not.toHaveBeenCalled();
    });
  });

  test('displays default error message on API failure ', async () => {
    (createGroup as Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400
      },
    });

    render(<CreateGroup />);

    // Enter group name
    fireEvent.change(screen.getByPlaceholderText(/Enter Group Name/i), {
      target: { value: 'Invalid Group' },
    });

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /Create Group/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Error 400: undefined/i)
      ).toBeInTheDocument();
    });
  });
  
});
