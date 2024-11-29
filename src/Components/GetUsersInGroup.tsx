import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { getUsersInGroup } from '../api'; // Import your API function
import { UserinGroupI } from '../Interface'; // Import your interface

const GetUsersInGroup: React.FC = () => {
  const [groupId, setGroupId] = useState<string>(''); // State for group ID input
  const [users, setUsers] = useState<UserinGroupI[]>([]); // State for users in the group
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  // Fetch users in group API call
  const fetchUsers = useCallback(async () => {
    if (!groupId.trim()) {
      setErrorMessage('Group ID is required.');
      setSuccessMessage(null);
      setUsers([]);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Make the API call
      const groupIDNumber = parseInt(groupId, 10);
      if (isNaN(groupIDNumber)) {
        setErrorMessage('Group ID must be a valid number.');
        return;
      }

      const response = await getUsersInGroup(groupIDNumber);
      console.log('API Response:', response); // Debugging

      setUsers(response); // Set the fetched users
      setSuccessMessage('Successfully fetched users in the group.');
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
  }, [groupId]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold text-center">Get Group Users</h2>

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
      <button onClick={fetchUsers} className="btn btn-primary btn-lg mt-3">
        Fetch Users
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

      {/* Users Display */}
      {users.length > 0 ? (
        <div className="mt-3">
          <h4>Users in Group:</h4>
          <ul className="list-unstyled">
            {users.map((user) => (
              <li key={user.id} className="border rounded p-3 mb-2">
                <strong>User ID:</strong> {user.id} <br />
                <strong>User Name:</strong> {user.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !errorMessage && successMessage && <p className="mt-3">No users found in this group.</p>
      )}
    </div>
  );
};

export default GetUsersInGroup;
