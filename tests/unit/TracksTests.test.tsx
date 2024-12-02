import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach, vi, Mock } from 'vitest';
import Tracks from '../../src/Components/Tracks.tsx';
import { getTracks } from '../../src/api.ts';
import '@testing-library/jest-dom';

// Mock the API call
vi.mock('../../src/api.ts');

describe('Tracks Component', () => {
  afterEach(() => {
    vi.clearAllMocks(); // Clear any previous mocks after each test
  });

  test('displays tracks when API call is successful', async () => {
    // Arrange
    const mockTracks = ['Track 1', 'Track 2', 'Track 3'];
    (getTracks as Mock).mockResolvedValueOnce(mockTracks); // Mock the API to return tracks

    // Act
    render(<Tracks />);

    // Assert
    const trackItems = await screen.findAllByRole('listitem');
    expect(trackItems).toHaveLength(mockTracks.length); // Check that the correct number of tracks are displayed
    expect(trackItems[0]).toHaveTextContent('Track 1'); // Check the first track
    expect(trackItems[1]).toHaveTextContent('Track 2'); // Check the second track
    expect(trackItems[2]).toHaveTextContent('Track 3'); // Check the third track
  });

  test('displays specific error message when an AxiosError occurs', async () => {
    // Arrange: Simulate an AxiosError with a 404 response
    (getTracks as Mock).mockRejectedValueOnce({
      isAxiosError: true,  // Explicitly mark this as an AxiosError
      response: {
        status: 404,
        data: { error: 'Tracks not found' },
      },
      message: 'Request failed with status code 404',
    });
  
    // Act
    render(<Tracks />);
  
    // Assert: Check that the component displays the specific Axios error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: Tracks not found');
  });

  test('displays a default error message for non-Axios errors', async () => {
    // Arrange: Simulate a non-Axios error
    (getTracks as Mock).mockRejectedValueOnce(new Error('Unexpected error'));

    // Act
    render(<Tracks />);

    // Assert: Check that the component displays the default error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('An unexpected error occurred.');
  });

  test('displays specific error message when an AxiosError occurs', async () => {
    // Arrange: Simulate an AxiosError with a 404 response
    (getTracks as Mock).mockRejectedValueOnce({
      isAxiosError: true,  // Explicitly mark this as an AxiosError
      response: {
        status: 404
      }
    });
  
    // Act
    render(<Tracks />);
  
    // Assert: Check that the component displays the specific Axios error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: undefined');
  });
});
