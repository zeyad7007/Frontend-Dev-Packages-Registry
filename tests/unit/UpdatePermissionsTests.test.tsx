import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, test, expect, Mock } from 'vitest';
import UpdatePermissions from '../../src/Components/UpdatePermissions';
import { updatePermissions } from '../../src/api';
import '@testing-library/jest-dom';

vi.mock('../../src/api', () => ({
  updatePermissions: vi.fn(),
}));

describe('UpdatePermissions Component', () => {
  let mockUpdatePermissions: typeof updatePermissions;

  beforeEach(() => {
    mockUpdatePermissions = vi.mocked(updatePermissions);
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly with all fields and buttons', () => {
    render(<UpdatePermissions />);

    // Assert header
    expect(
      screen.getByRole('heading', { name: /Update User Permissions/i })
    ).toBeInTheDocument();

    // Assert user ID input
    expect(screen.getByLabelText(/User ID/i)).toBeInTheDocument();

    // Assert permission checkboxes
    expect(screen.getByLabelText(/Download/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload/i)).toBeInTheDocument();

    // Assert submit button
    expect(
      screen.getByRole('button', { name: /Update Permissions/i })
    ).toBeInTheDocument();
  });

  test('displays error if User ID is missing', async () => {
    render(<UpdatePermissions />);

    // Attempt to submit without entering a User ID
    fireEvent.click(
      screen.getByRole('button', { name: /Update Permissions/i })
    );

    // Assert error message
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'User ID is required.'
      )
    );
  });

  test('updates permissions state when checkboxes are toggled', () => {
    render(<UpdatePermissions />);

    // Toggle Download permission
    const downloadCheckbox = screen.getByLabelText(/Download/i);
    fireEvent.click(downloadCheckbox);
    expect(downloadCheckbox).toBeChecked();

    // Toggle Search permission
    const searchCheckbox = screen.getByLabelText(/Search/i);
    fireEvent.click(searchCheckbox);
    expect(searchCheckbox).toBeChecked();

    // Toggle Upload permission
    const uploadCheckbox = screen.getByLabelText(/Upload/i);
    fireEvent.click(uploadCheckbox);
    expect(uploadCheckbox).toBeChecked();
  });

  test('submits the updated permissions successfully', async () => {
    const mockResponse = { message: 'Permissions updated successfully.' };
    (updatePermissions as Mock).mockResolvedValueOnce(mockResponse);

    render(<UpdatePermissions />);

    // Fill in the User ID
    fireEvent.change(screen.getByLabelText(/User ID/i), {
      target: { value: '123' },
    });

    // Toggle some permissions
    fireEvent.click(screen.getByLabelText(/Download/i));
    fireEvent.click(screen.getByLabelText(/Search/i));

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /Update Permissions/i })
    );

    // Assert success message
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Permissions updated successfully.'
      )
    );

    // Assert API call
    expect(mockUpdatePermissions).toHaveBeenCalledWith('123', {
      can_download: true,
      can_search: true,
      can_upload: false,
    });
  });

  test('handles API error with specific error message', async () => {
    (updatePermissions as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 403, data: { error: 'Permission denied' } },
    });
  
    render(<UpdatePermissions />);
  
    // Fill in the User ID and toggle permissions
    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByLabelText(/Download/i));
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Update Permissions/i }));
  
    // Assert error message
    await waitFor(() => {
      expect(screen.getByText('Error 403: Permission denied')).toBeInTheDocument();
      expect(screen.queryByText(/Permissions updated successfully./i)).not.toBeInTheDocument();
    });
  });
  

  test('displays "An unexpected error occurred." for non-Axios errors', async () => {
    (updatePermissions as Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<UpdatePermissions />);

    // Fill in the User ID
    fireEvent.change(screen.getByLabelText(/User ID/i), {
      target: { value: '123' },
    });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /Update Permissions/i })
    );

    // Assert error message
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An unexpected error occurred.'
      )
    );
  });

  test('handles API error with specific error message', async () => {
    (updatePermissions as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 403},
    });
  
    render(<UpdatePermissions />);
  
    // Fill in the User ID and toggle permissions
    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: '123' } });
    fireEvent.click(screen.getByLabelText(/Download/i));
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Update Permissions/i }));
  
    // Assert error message
    await waitFor(() => {
      expect(screen.getByText('Error 403: undefined')).toBeInTheDocument();
      expect(screen.queryByText(/Permissions updated successfully./i)).not.toBeInTheDocument();
    });
  });
});
