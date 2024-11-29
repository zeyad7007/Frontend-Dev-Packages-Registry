import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { registerUser } from '../api'; // Import the API function
import { UserRegisterI } from '../Interface'; // Import the interface

const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState<UserRegisterI>({
    name: '',
    password: '',
    isAdmin: false,
    groupId: 0, // No default value, will validate this field
    canDownload: false,
    canSearch: false,
    canUpload: false,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle input changes for text, number, and checkbox inputs
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = e.target;
      const { name, value, type } = target;
      const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

      setFormData((prev) => ({
        ...prev,
        [name]: checked !== undefined ? checked : value,
      }));
    },
    []
  );

  // Submit the registration form
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setSuccessMessage(null);
        setErrorMessage(null);

        const message = await registerUser(formData);
        setSuccessMessage(message);

        // Reset form data after successful registration
        setFormData({
          name: '',
          password: '',
          isAdmin: false,
          groupId: 0,
          canDownload: false,
          canSearch: false,
          canUpload: false,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          const statusCode = axiosError.response?.status || 'Unknown status code';
          const errorData = axiosError.response?.data;
          let errorText = '';

          if (errorData && typeof errorData === 'object') {
            errorText = (errorData as { error?: string }).error || axiosError.message;
          } else {
            errorText = axiosError.message;
          }

          setErrorMessage(`Error ${statusCode}: ${errorText}`);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }

        setSuccessMessage(null); // Clear success message if there’s an error
      }
    },
    [formData]
  );

  return (
    <div className="container mt-5">
      <h1 className="display-4 fw-bold text-center">Register User</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-bold">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control form-control-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control form-control-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Is Admin */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            className="form-check-input"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
          <label htmlFor="isAdmin" className="form-check-label">Admin</label>
        </div>

        {/* Group ID */}
        <div className="mb-3">
          <label htmlFor="groupId" className="form-label fw-bold">Group ID</label>
          <input
            type="number"
            id="groupId"
            name="groupId"
            className="form-control form-control-lg"
            value={formData.groupId || ''}
            onChange={handleChange}
            required
          />
        </div>

        {/* Permissions */}
        <h4 className="fw-bold">Permissions</h4>
        <div className="form-check">
          <input
            type="checkbox"
            id="canDownload"
            name="canDownload"
            className="form-check-input"
            checked={formData.canDownload}
            onChange={handleChange}
          />
          <label htmlFor="canDownload" className="form-check-label">Download</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="canSearch"
            name="canSearch"
            className="form-check-input"
            checked={formData.canSearch}
            onChange={handleChange}
          />
          <label htmlFor="canSearch" className="form-check-label">Search</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="canUpload"
            name="canUpload"
            className="form-check-input"
            checked={formData.canUpload}
            onChange={handleChange}
          />
          <label htmlFor="canUpload" className="form-check-label">Upload</label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary btn-lg mt-4">Register</button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
