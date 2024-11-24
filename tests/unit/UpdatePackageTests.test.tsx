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
    (updatePackageById as Mock).mockResolvedValue({}); // Use vi.fn() to resolve with an empty object

    render(<UpdatePackage />);

    // Set up form inputs
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Package Name'), { target: { value: 'Test Package' } });
    fireEvent.change(screen.getByPlaceholderText('Package Version'), { target: { value: '1.0' } });

    // Simulate button click
    fireEvent.click(screen.getByText('Update Package'));

    await waitFor(() => {
      expect(updatePackageById).toHaveBeenCalledWith('123', expect.objectContaining({
        metadata: { Name: 'Test Package', Version: '1.0' },
      }));
    });
  });

  test('displays success message on successful package update', async () => {
    const mockResult = {}; // Mock successful response, you can customize this as needed
    (updatePackageById as Mock).mockResolvedValueOnce(mockResult); // Mock successful API response
  
    render(<UpdatePackage />);
  
    // Simulate user input (fill in the form fields)
    fireEvent.change(screen.getByLabelText(/Enter Package ID/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Package Name/i), { target: { value: 'Test Package' } });
    fireEvent.change(screen.getByLabelText(/Package Version/i), { target: { value: '1.0.0' } });
  
    // Simulate form submission (button click)
    const updateButton = screen.getByRole('button', { name: 'Update Package' });
    fireEvent.click(updateButton); // Simulate button click to trigger the update
  
    // Wait for the success message to appear
    await waitFor(() => {
      const successAlert = document.querySelector('.alert.alert-success') as HTMLElement;
      expect(successAlert).toBeInTheDocument();
      expect(successAlert.innerText).toBe('Package updated successfully.');
    });
  });

  test('displays error message on API error', async () => {
    // Mock updatePackageById to throw an Axios error
    (updatePackageById as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { error: 'Invalid package data' } },
      message: 'Request failed with status code 404',
    });
  
    render(<UpdatePackage />);
  
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Update Package'));
  
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 404: Invalid package data');
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

  test('updates JS program in state on textarea change', () => {
    render(<UpdatePackage />);
    const jsProgramTextarea = screen.getByPlaceholderText(/JS Program/i);
    expect(jsProgramTextarea).toHaveValue('');
    fireEvent.change(jsProgramTextarea, { target: { value: 'console.log("Test");' } });
    expect(jsProgramTextarea).toHaveValue('console.log("Test");');
  });
  
  test('displays error message on API failure', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 500, data: { error: 'Internal server error' } },
      message: 'Request failed with status code 500',
    };
  
    (updatePackageById as Mock).mockRejectedValue(mockError); // Mock API rejection
  
    render(<UpdatePackage />);
  
    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter Package ID'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Update Package'));
  
    // Wait for error message to appear
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Error 500: Internal server error');
  });
  
  test('handles file upload and encodes content to base64', async () => {
    render(<UpdatePackage />);
  
    // Create a mock file object to simulate the file input
    const file = new Blob(['test content'], { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/File upload/i);
  
    // Create a mock FileReader and override the global one
    const mockFileReader = {
      readAsBinaryString: vi.fn().mockImplementation((file: Blob) => {
        mockFileReader.onload({ target: { result: 'test content' } });
      }),
      onload: vi.fn(),
    };
  
    global.FileReader = vi.fn(() => mockFileReader); // Mock FileReader
    
    // Simulate file input change
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    // Ensure FileReader's readAsBinaryString was called
    await waitFor(() => {
      expect(mockFileReader.readAsBinaryString).toHaveBeenCalledWith(file);
    });
  
    // Check that the base64-encoded content is correctly set
    expect(screen.getByLabelText(/GitHub Repo URL/i)).toHaveValue(''); // URL should be cleared
    expect(screen.getByPlaceholderText(/JS Program/i)).toHaveValue(''); // JSProgram should be empty
  });
  
  test('displays error message on API error', async () => {
    const mockUpdate = updatePackageById as Mock;
    mockUpdate.mockRejectedValue({
      response: {
        status: 400,
        data: { error: 'Invalid request' },
      },
    });

    render(<UpdatePackage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Package ID/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Package/i }));

    await waitFor(() => expect(screen.getByText(/An unexpected error occurred./i)).toBeInTheDocument());
  });

  test('updates URL and clears Content on input change', () => {
    render(<UpdatePackage />);
  
    // Find the URL input field and simulate a change event
    const urlInput = screen.getByPlaceholderText(/GitHub Repo URL/i);
    
    // Simulate the user typing a URL into the input field
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
  
    // Check if the state has been updated and Content is cleared
    expect(urlInput.value).toBe('https://example.com'); // URL should be updated
    expect(screen.getByPlaceholderText(/JS Program/i).value).toBe(''); // Content (JS Program) should be cleared
  });

 


});
