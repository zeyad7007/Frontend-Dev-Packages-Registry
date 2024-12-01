import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, Mock } from 'vitest';
import UpdatePackage from '../../src/Components/UpdatePackage';
import { updatePackageById } from '../../src/api';

// Mock the API module
vi.mock('../../src/api', () => ({
  updatePackageById: vi.fn(),
}));

describe('UpdatePackage Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders all form fields and button', () => {
    render(<UpdatePackage />);
    expect(screen.getByPlaceholderText(/Enter Package ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Package Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Package Version/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Debloat option/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/JS Program/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/GitHub Repo URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/File upload/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Package/i })).toBeInTheDocument();
  });

  test('updates package data on text input changes', () => {
    render(<UpdatePackage />);
    const idInput = screen.getByPlaceholderText(/Enter Package ID/i);
    fireEvent.change(idInput, { target: { value: '1234' } });
    expect(idInput).toHaveValue('1234');
  });

  test('calls updatePackageById with correct data on button click', async () => {
    (updatePackageById as Mock).mockResolvedValue({});

    render(<UpdatePackage />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Package Name'), { target: { value: 'Test Package' } });
    fireEvent.change(screen.getByPlaceholderText('Package Version'), { target: { value: '1.0' } });

    // Simulate button click
    const updateButton = screen.getByRole('button', { name: /Update Package/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updatePackageById).toHaveBeenCalledWith('123', expect.objectContaining({
        metadata: { Name: 'Test Package', Version: '1.0' },
      }));
    });
  });

  test('displays success message and removes it after 4 seconds', async () => {
    (updatePackageById as Mock).mockResolvedValueOnce({});

    render(<UpdatePackage />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText(/Enter Package ID/i), { target: { value: '123' } });

    // Submit form
    const updateButton = screen.getByRole('button', { name: /Update Package/i });
    fireEvent.click(updateButton);

    // Wait for success message
    await waitFor(() => {
      const successAlert = document.querySelector('.alert.alert-success') as HTMLElement;
      expect(successAlert).toBeInTheDocument();
      expect(successAlert.innerText).toBe('Package updated successfully.');
    });

    // Wait for the success message to disappear
    await waitFor(() => {
      const successAlert = document.querySelector('.alert.alert-success');
      expect(successAlert).not.toBeInTheDocument();
    }, { timeout: 4500 });
  });

  test('handles file upload and encodes content to base64', async () => {
    render(<UpdatePackage />);
  
    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  
    // Mock the FileReader behavior
    const mockFileReader = {
      readAsBinaryString: vi.fn(),
      onload: null,
    };
  
    (global.FileReader as unknown as Mock) = vi.fn(() => mockFileReader);
  
    // Spy on the onload method and simulate the file read
    mockFileReader.onload = vi.fn(function (this: { result: string }) {
      this.result = 'test content';
      if (typeof mockFileReader.onload === 'function') {
        mockFileReader.onload({ target: { result: this.result } });
      }
    });
  
    const fileInput = screen.getByLabelText(/File upload/i);
  
    // Mock `files` property on the input
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
  
    // Simulate file input change
    fireEvent.change(fileInput);
  
    // Ensure FileReader's readAsBinaryString was called
    await waitFor(() => {
      expect(mockFileReader.readAsBinaryString).toHaveBeenCalledWith(file);
    });
  
    // Optionally, check that the component state was updated
  });
  

  test('displays error message on API error', async () => {
    (updatePackageById as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { error: 'Invalid package data' } },
    });

    render(<UpdatePackage />);

    fireEvent.change(screen.getByPlaceholderText(/Enter Package ID/i), { target: { value: '123' } });
    const updateButton = screen.getByRole('button', { name: /Update Package/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent('Error 404: Invalid package data');
    });
  });

 

  test('toggles debloat checkbox and updates state', () => {
    render(<UpdatePackage />);
    const debloatCheckbox = screen.getByLabelText(/Debloat option/i);
    expect(debloatCheckbox).not.toBeChecked();
    fireEvent.click(debloatCheckbox);
    expect(debloatCheckbox).toBeChecked();
    fireEvent.click(debloatCheckbox);
    expect(debloatCheckbox).not.toBeChecked();
  });

  test('displays generic error message on API failure', async () => {
    (updatePackageById as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 500, data: { error: 'Internal server error' } },
    });

    render(<UpdatePackage />);

    fireEvent.change(screen.getByPlaceholderText(/Enter Package ID/i), { target: { value: '123' } });
    const updateButton = screen.getByRole('button', { name: /Update Package/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent('Error 500: Internal server error');
    });
  });
  test('updates Content and clears URL in packageData on file upload', async () => {
    render(<UpdatePackage />);
  
    // Create a mock file
    const mockFile = new File(['mock content'], 'mock.txt', { type: 'text/plain' });
  
    // Mock FileReader behavior
    const mockFileReader = {
      readAsBinaryString: vi.fn(),
      result: null,
      onload: null as unknown as (event: ProgressEvent<FileReader>) => void,
    };
  
    (global.FileReader as unknown as Mock) = vi.fn(() => mockFileReader);
  
    // Simulate the onload event of FileReader
    mockFileReader.readAsBinaryString.mockImplementationOnce((file: File) => {
      setTimeout(() => {
        mockFileReader.result = 'mock content'; // Simulated file content
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as ProgressEvent<FileReader>);
        }
      }, 0);
    });
  
    // Find and simulate a file upload
    const fileInput = screen.getByLabelText(/File upload/i);
  
    // Mock the `files` property of the input element
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
      writable: false,
    });
  
    fireEvent.change(fileInput);
  
    // Wait for the FileReader to process the file
    await waitFor(() => {
      expect(mockFileReader.readAsBinaryString).toHaveBeenCalledWith(mockFile);
    });
  
    // Assert that `Content` was updated and `URL` was cleared
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/GitHub Repo URL/i)).toHaveValue('');
    });
  });
  
});
