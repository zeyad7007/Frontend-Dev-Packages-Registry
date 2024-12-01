import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import Logout from '../../src/Components/Logout';
import { logout } from '../../src/api';

// Mock the API module
vi.mock('../../src/api', () => ({
  logout: vi.fn(),
}));

describe('Logout Component', () => {
    const mockOnLogout = vi.fn();
  
    beforeEach(() => {
      vi.resetAllMocks();
      mockOnLogout.mockClear();
    });
  
    test('renders the logout button', () => {
      render(<Logout onLogout={mockOnLogout} />);
      const button = screen.getByRole('button', { name: /logout/i });
      expect(button).toBeInTheDocument();
    });
  
    test('calls logout API and displays success message on success', async () => {
      (logout as Mock).mockResolvedValueOnce('Logout successful.');
  
      render(<Logout onLogout={mockOnLogout} />);
      const button = screen.getByRole('button', { name: /logout/i });
  
      fireEvent.click(button);
  
      await waitFor(() => {
        expect(screen.getByText('Logout successful.')).toBeInTheDocument();
        expect(mockOnLogout).toHaveBeenCalledTimes(1);
      });
    });
  
    test('displays error message on API failure', async () => {
      (logout as Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 401, data: { error: 'Unauthorized' } },
      });
  
      render(<Logout onLogout={mockOnLogout} />);
      const button = screen.getByRole('button', { name: /logout/i });
  
      fireEvent.click(button);
  
      await waitFor(() => {
        expect(screen.getByText('Error 401: Unauthorized')).toBeInTheDocument();
        expect(mockOnLogout).not.toHaveBeenCalled();
      });
    });
  
    test('displays generic error message on unexpected error', async () => {
      (logout as Mock).mockRejectedValueOnce(new Error('Unexpected error'));
  
      render(<Logout onLogout={mockOnLogout} />);
      const button = screen.getByRole('button', { name: /logout/i });
  
      fireEvent.click(button);
  
      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
        expect(mockOnLogout).not.toHaveBeenCalled();
      });
    });
  
    test('clears error message and success message on new logout attempt', async () => {
      (logout as Mock).mockResolvedValueOnce('Logout successful.');
  
      render(<Logout onLogout={mockOnLogout} />);
      const button = screen.getByRole('button', { name: /logout/i });
  
      fireEvent.click(button);
  
      await waitFor(() => {
        expect(screen.getByText('Logout successful.')).toBeInTheDocument();
      });
  
      fireEvent.click(button);
  
      await waitFor(() => {
        expect(screen.queryByText('Logout successful.')).not.toBeInTheDocument();
      });
    });
    test('displays deafult error message on API failure', async () => {
        (logout as Mock).mockRejectedValueOnce({
          isAxiosError: true,
          response: { status: 401 },
        });
    
        render(<Logout onLogout={mockOnLogout} />);
        const button = screen.getByRole('button', { name: /logout/i });
    
        fireEvent.click(button);
    
        await waitFor(() => {
          expect(screen.getByText('Error 401: undefined')).toBeInTheDocument();
          expect(mockOnLogout).not.toHaveBeenCalled();
        });
      });
  });
  