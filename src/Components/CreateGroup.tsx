import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { createGroup } from '../api'; // Import the createGroup function
import { GroupI } from '../Interface'; // Import the Group interface

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState<string>(''); // State for group name input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  // Function to handle form submission
  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim()) {
      setErrorMessage('Group name is required.');
      setSuccessMessage(null);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const groupData: GroupI = { name: groupName }; // Prepare the request body
      const groupId = await createGroup(groupData); // Call the API
      setSuccessMessage(`Group created successfully with ID: ${groupId}`);
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
  }, [groupName]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold text-center">Create a New Group</h2>

      {/* Group Name Input */}
      <div className="form-group mt-3">
        <label htmlFor="groupNameInput" className="form-label fw-bold">
          Group Name
        </label>
        <input
          id="groupNameInput"
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleCreateGroup} className="btn btn-primary btn-lg mt-3">
        Create Group
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

export default CreateGroup;
