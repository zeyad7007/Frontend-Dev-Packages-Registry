import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, vi, beforeEach, Mock } from 'vitest';
import UploadPackage from '../../src/Components/UploadPackage';
import { uploadPackage } from '../../src/api';
import '@testing-library/jest-dom'; // Ensure this is for dom matchers
import React from 'react';

// Mock uploadPackage function
vi.mock('../../src/api', () => ({
  uploadPackage: vi.fn(),
}));

describe('UploadPackage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<UploadPackage />);
    
    // Check if input fields are rendered
    expect(screen.getByPlaceholderText('Package Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('JS Program')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('GitHub Repo URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Debloat option')).toBeInTheDocument();
    expect(screen.getByLabelText('File upload')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload Package' })).toBeInTheDocument();
  });

  test('handles package name input change', () => {
    render(<UploadPackage />);

    const packageNameInput = screen.getByPlaceholderText('Package Name') as HTMLInputElement;
    fireEvent.change(packageNameInput, { target: { value: 'Test Package' } });
    expect(packageNameInput.value).toBe('Test Package');
  });

  test('handles JavaScript program input change', () => {
    render(<UploadPackage />);

    const jsProgramInput = screen.getByPlaceholderText('JS Program') as HTMLInputElement;
    fireEvent.change(jsProgramInput, { target: { value: 'console.log("Hello")' } });
    expect(jsProgramInput.value).toBe('console.log("Hello")');
  });

  test('handles GitHub URL input change', () => {
    render(<UploadPackage />);

    const urlInput = screen.getByPlaceholderText('GitHub Repo URL') as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'https://github.com/test/repo' } });
    expect(urlInput.value).toBe('https://github.com/test/repo');
  });

  test('toggles debloat checkbox', () => {
    render(<UploadPackage />);

    const debloatCheckbox = screen.getByLabelText('Debloat option') as HTMLInputElement;
    expect(debloatCheckbox.checked).toBe(false);
    fireEvent.click(debloatCheckbox);
    expect(debloatCheckbox.checked).toBe(true);
  });

  test('displays error message on API failure', async () => {
    // Mock the uploadPackage function to simulate an Axios error
    (uploadPackage as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: { error: 'Tracks not found' },
      },
      message: 'Request failed with status code 404',
    });

    render(<UploadPackage />);

    const uploadButton = screen.getByRole('button', { name: 'Upload Package' });
    fireEvent.click(uploadButton);

    // Assert: Check that the component displays the specific Axios error message
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: Tracks not found');
  });

  test('displays generic error message for non-axios errors', async () => {
    (uploadPackage as Mock).mockRejectedValueOnce(new Error('Unknown error'));

    render(<UploadPackage />);

    const uploadButton = screen.getByRole('button', { name: 'Upload Package' });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred.');
    });
  });

    test('displays success message on successful upload', async () => {
    const mockResult = { metadata: { ID: '12345' } };
    (uploadPackage as Mock).mockResolvedValueOnce(mockResult); // Mock successful API response

    render(<UploadPackage />);
    
    // Fill in the required fields before clicking upload
    fireEvent.change(screen.getByLabelText(/Package Name/i), {
      target: { value: 'Test Package' }
    });
    fireEvent.change(screen.getByLabelText(/JavaScript Program/i), {
      target: { value: 'console.log("Hello, World!");' }
    });
    
    // Simulate file upload
    const fileInput = screen.getByLabelText(/File upload/i);
    const file = new File(['dummy content'], 'example.js', { type: 'text/javascript' });
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    // Click the upload button
    const uploadButton = screen.getByRole('button', { name: 'Upload Package' });
    fireEvent.click(uploadButton); // Simulate button click to trigger upload

    // Assert: Wait for the success message to appear
    await waitFor(() => {
        const successAlert = document.querySelector('.alert.alert-success') as HTMLElement; // Assert as HTMLElement
        expect(successAlert).toBeInTheDocument();
        expect(successAlert.innerText).toBe(`Package uploaded with ID: ${mockResult.metadata.ID}`);
    });
});



  test('handles file upload', async () => {
    const file = new File(['file content'], 'test.js', { type: 'text/javascript' });
    render(<UploadPackage />);
  
    const fileInput = screen.getByLabelText('File upload') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    // Wait for state update
    await waitFor(() => {
      expect(fileInput.files).toHaveLength(1);
      if (fileInput.files) {
        expect(fileInput.files[0].name).toBe('test.js');
      }
    });
  });
});
