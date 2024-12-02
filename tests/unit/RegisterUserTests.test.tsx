import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import RegisterUser from '../../src/Components/RegisterUser';
import { registerUser } from '../../src/api';
import '@testing-library/jest-dom';

vi.mock('../../src/api', () => ({
  registerUser: vi.fn(),
}));

describe('RegisterUser Component', () => {
  const mockRegisterUser = vi.mocked(registerUser);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the form fields and submit button', () => {
    render(<RegisterUser />);

    // Check that input fields and labels are rendered
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Download/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload/i)).toBeInTheDocument();

    // Check that the submit button is rendered
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('updates state on user input', () => {
    render(<RegisterUser />);

    // Simulate input changes
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '42' } });
    fireEvent.click(screen.getByLabelText(/Admin/i));
    fireEvent.click(screen.getByLabelText(/Download/i));

    // Assert that input values are updated
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
    expect(screen.getByLabelText(/Group ID/i)).toHaveValue(42);
    expect(screen.getByLabelText(/Admin/i)).toBeChecked();
    expect(screen.getByLabelText(/Download/i)).toBeChecked();
  });

  test('submits the form successfully and resets state', async () => {
    mockRegisterUser.mockResolvedValueOnce('User registered successfully.');

    render(<RegisterUser />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securePassword' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '12' } });
    fireEvent.click(screen.getByLabelText(/Admin/i));
    fireEvent.click(screen.getByLabelText(/Upload/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User registered successfully.');
    });

    // Assert that form state is reset
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('');
    expect(screen.getByLabelText(/Group ID/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Admin/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Upload/i)).not.toBeChecked();
  });

  test('displays API error message on submission failure', async () => {
    (registerUser as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400, data: { error: 'Invalid group ID.' } },
    });
  
    render(<RegisterUser />);
  
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '999' } });
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Error 400: Invalid group ID.')).toBeInTheDocument();
    });
  
    // Assert that success message is not displayed
    expect(screen.queryByText('User registered successfully.')).not.toBeInTheDocument();
  });
  
  test('displays default API error message on submission failure', async () => {
    (registerUser as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400},
    });
  
    render(<RegisterUser />);
  
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '999' } });
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Error 400: undefined')).toBeInTheDocument();
    });
  
    // Assert that success message is not displayed
    expect(screen.queryByText('User registered successfully.')).not.toBeInTheDocument();
  });

  test('displays unexpected error message for non-Axios errors', async () => {
    // Mock the `registerUser` function to throw a non-Axios error
    mockRegisterUser.mockRejectedValueOnce(new Error('Some unexpected error'));
  
    render(<RegisterUser />);
  
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Group ID/i), { target: { value: '1' } });
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred.');
    });
  
    // Assert that success message is not displayed
    expect(screen.queryByText('User registered successfully.')).not.toBeInTheDocument();
  });
  
});
