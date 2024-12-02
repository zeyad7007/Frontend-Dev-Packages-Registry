import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, Mock } from 'vitest';
import '@testing-library/jest-dom';
import GetGroups from '../../src/Components/GetGroups';
import { getGroups } from '../../src/api';

// Mock the API function
vi.mock('../../src/api', () => ({
  getGroups: vi.fn(),
}));

describe('GetGroups Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders the heading and initial state', () => {
    render(<GetGroups />);

    // Check for heading
    expect(screen.getByRole('heading', { name: /All Groups/i })).toBeInTheDocument();

    // Check for no groups message initially
    expect(screen.getByText(/No groups available./i)).toBeInTheDocument();
  });

  test('displays groups on successful fetch', async () => {
    // Mock the API response with a list of groups
    (getGroups as Mock).mockResolvedValueOnce([
      { id: 1, group_name: 'Group 1' },
      { id: 2, group_name: 'Group 2' },
    ]);

    render(<GetGroups />);

    // Check if success message appears
    await waitFor(() => {
      expect(screen.getByText(/Successfully fetched groups/i)).toBeInTheDocument();
    });

    // Check if groups are displayed
    expect(screen.getByText(/Group 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Group 2/i)).toBeInTheDocument();
  });

  test('displays error message on API error', async () => {
    // Mock the API to throw an error
    (getGroups as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500, data: { error: 'Internal Server Error' } },
    });

    render(<GetGroups />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Error 500: Internal Server Error/i)
      ).toBeInTheDocument();
    });

    // Ensure no groups are displayed
    expect(screen.queryByText(/Groups List:/i)).not.toBeInTheDocument();
  });

  test('displays a generic error message for non-Axios errors', async () => {
    // Mock a non-Axios error
    (getGroups as Mock).mockRejectedValueOnce(new Error('Unexpected Error'));

    render(<GetGroups />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred./i)
      ).toBeInTheDocument();
    });
  });

  test('renders the no groups available message if no groups are returned', async () => {
    // Mock the API response with an empty list
    (getGroups as Mock).mockResolvedValueOnce([]);

    render(<GetGroups />);

    // Wait for the no groups message to appear
    await waitFor(() => {
      expect(screen.getByText(/No groups available./i)).toBeInTheDocument();
    });

    // Ensure no group items are rendered
    expect(screen.queryByText(/Group ID:/i)).not.toBeInTheDocument();
  });

  test('displays default error message on API error', async () => {
    // Mock the API to throw an error
    (getGroups as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 }
    });

    render(<GetGroups />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Error 404: undefined/i)
      ).toBeInTheDocument();
    });

    // Ensure no groups are displayed
    expect(screen.queryByText(/Groups List:/i)).not.toBeInTheDocument();
  });
});
