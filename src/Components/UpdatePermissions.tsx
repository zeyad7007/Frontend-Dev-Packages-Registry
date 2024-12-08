import React, { useState, useCallback } from 'react';
import { updatePermissions } from '../api'; // Import the API function
import axios, { AxiosError } from 'axios';
import { PermissionsI, UserPermissionsResponseI } from '../Interface';

const UpdatePermissions: React.FC = () => {
  const [userId, setUserId] = useState<string>(''); // User ID input
  const [permissions, setPermissions] = useState<PermissionsI>({
    can_download: false,
    can_search: false,
    can_upload: false,
  }); // Permissions state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePermissionChange = (field: keyof PermissionsI, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePermissions = useCallback(async () => {
    if (!userId) {
      setErrorMessage('User ID is required.');
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Call the API to update permissions
      const response: UserPermissionsResponseI = await updatePermissions(userId, permissions);
      setSuccessMessage(response.message); // Display success message
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        const statusCode = axiosError.response?.status || 'Unknown status code';
        const errorData = axiosError.response?.data;
        let errorMessage = '';
        if (errorData && typeof errorData === 'object') {
          errorMessage = (errorData as { error?: string }).error || axiosError.message;
        } else {
          errorMessage = axiosError.message;
        }
        setErrorMessage(`Error ${statusCode}: ${errorMessage}`);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      console.error('Failed to update permissions', err);
    }
  }, [userId, permissions]);

  return (
    <div className="container mt-4">
      <h2 id="updatePermissionsHeader" className="display-4 fw-bold text-center">Update User Permissions</h2>

      {/* User ID Input */}
      <div className="form-group mt-3">
        <label htmlFor="userId" id="user" className="form-label fw-bold">User ID</label>
        <input
          id="userId"
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      {/* Permissions Form */}
      <div className="form-group mt-3">
        <label id="permissions" className="fw-bold">Permissions</label>
        <div className="form-check">
          <input
            type="checkbox"
            id="canDownload"
            className="form-check-input"
            checked={permissions.can_download}
            onChange={(e) => handlePermissionChange('can_download', e.target.checked)}
          />
          <label htmlFor="canDownload" id="download" className="form-check-label">Download</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="canSearch"
            className="form-check-input"
            checked={permissions.can_search}
            onChange={(e) => handlePermissionChange('can_search', e.target.checked)}
          />
          <label htmlFor="canSearch" id="search" className="form-check-label">Search</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="canUpload"
            className="form-check-input"
            checked={permissions.can_upload}
            onChange={(e) => handlePermissionChange('can_upload', e.target.checked)}
          />
          <label htmlFor="canUpload" id="upload" className="form-check-label">Upload</label>
        </div>
      </div>

      {/* Submit Button */}
      <button onClick={handleUpdatePermissions} id="updatePermissionsButton" className="btn btn-primary btn-lg mt-3">
        Update Permissions
      </button>

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default UpdatePermissions;
