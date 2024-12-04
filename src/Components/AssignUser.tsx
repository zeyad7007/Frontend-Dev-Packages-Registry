import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { assignUserToGroup } from '../api'; // Import the assignUserToGroup function
import { UsertoGroupI } from '../Interface'; // Import the UsertoGroupI interface

const AssignUserToGroup: React.FC = () => {
  const [userId, setUserId] = useState<string>(''); // State for user ID input
  const [groupId, setGroupId] = useState<string>(''); // State for group ID input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  const handleAssignUser = useCallback(async () => {
    // Validate inputs
    if (!userId.trim() || !groupId.trim()) {
      setErrorMessage('Both User ID and Group ID are required.');
      setSuccessMessage(null);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const requestData: UsertoGroupI = { user_id: parseInt(userId) }; // Prepare the request body
      const responseMessage = await assignUserToGroup(requestData, parseInt(groupId)); // Call the API
      setSuccessMessage(responseMessage); // Display success message
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
    }
  }, [userId, groupId]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold text-center">Assign User to Group</h2>

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
        />
      </div>

      {/* Group ID Input */}
      <div className="form-group mt-3">
        <label htmlFor="groupIdInput" className="form-label fw-bold">Group ID</label>
        <input
          id="groupIdInput"
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleAssignUser} id="submitButton" className="btn btn-primary btn-lg mt-3">
        Assign User to Group
      </button>

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger mt-3" id="errorMessage" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-3" id="successMessage" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AssignUserToGroup;
