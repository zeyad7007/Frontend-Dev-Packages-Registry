import React, { useState, useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { getGroups } from '../api'; // Import your API function
import { GroupResponseI } from '../Interface'; // Import your GroupResponseI interface

const GetGroups: React.FC = () => {
  const [groups, setGroups] = useState<GroupResponseI[]>([]); // State for groups
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  // Fetch all groups API call
  const fetchGroups = useCallback(async () => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await getGroups();
      console.log('Fetched Groups:', response); // Debugging
      setGroups(response); // Set the fetched groups
      setSuccessMessage('Successfully fetched groups.');
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
  }, []);

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold text-center">All Groups</h2>

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

      {/* Groups Display */}
      {groups.length > 0 ? (
        <div className="mt-3">
          <h4>Groups List:</h4>
          <ul className="list-unstyled">
            {groups.map((group) => (
              <li key={group.id} className="border rounded p-3 mb-2">
                <strong>Group ID:</strong> {group.id} <br />
                <strong>Group Name:</strong> {group.group_name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !errorMessage && <p className="mt-3">No groups available.</p>
      )}
    </div>
  );
};

export default GetGroups;
