import React, { useState, useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { getPermissions } from '../api'; // Import your Axios client setup
import { PermissionsI } from '../Interface'; // Import the interface for PermissionsI

const GetUserPermissions: React.FC = () => {
  const [userId, setUserId] = useState<string>(''); // State for user ID input
  const [permissions, setPermissions] = useState<PermissionsI | null>(null); // State for user permissions
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  // Debugging updated permissions state
  useEffect(() => {
    console.log('Updated Permissions:', permissions);
  }, [permissions]);

  // Fetch user permissions API call
  const fetchPermissions = useCallback(async () => {
    if (!userId.trim()) {
      setErrorMessage('User ID is required.');
      setSuccessMessage(null);
      setPermissions(null);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setPermissions(null);

      // Make the API call
      const response = await getPermissions(userId);
      console.log('API Response:', response); 

      if (Array.isArray(response)) {
        setPermissions(response[0]); 
      } else {
        setPermissions(response); 
      }

      setSuccessMessage('Successfully fetched user permissions.');
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

      setPermissions(null); // Reset permissions on error
    }
  }, [userId]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold text-center">Get User Permissions</h2>

      {/* User ID Input */}
      <div className="form-group mt-3">
        <label htmlFor="userIdInput" className="form-label fw-bold">User ID</label>
        <input
          id="userIdInput"
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button onClick={fetchPermissions} className="btn btn-primary btn-lg mt-3">
        Fetch Permissions
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

      {/* Permissions Display */}
      {permissions && (
        <div className="border rounded p-3 mt-3">
          <h4>User Permissions:</h4>
          <ul className="list-unstyled">
            <li><strong>Can Download:</strong> {permissions.can_download ? 'Yes' : 'No'}</li>
            <li><strong>Can Search:</strong> {permissions.can_search ? 'Yes' : 'No'}</li>
            <li><strong>Can Upload:</strong> {permissions.can_upload ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetUserPermissions;
