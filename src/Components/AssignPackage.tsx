import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { assignPackageToGroup } from '../api'; // Import the API function
import { PackettoGroupI } from '../Interface'; // Import the interface for request data

const AssignPackageToGroup: React.FC = () => {
  const [groupId, setGroupId] = useState<string>(''); // State for group ID input
  const [packageId, setPackageId] = useState<string>(''); // State for package ID input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  const handleAssignPackage = useCallback(async () => {
    // Validate inputs
    if (!groupId.trim() || !packageId.trim()) {
      setErrorMessage('Both Group ID and Package ID are required.');
      setSuccessMessage(null);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const requestData: PackettoGroupI = { package_id: parseInt(packageId) }; // Prepare the request body
      const responseMessage = await assignPackageToGroup(requestData, parseInt(groupId)); // Call the API
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
  }, [groupId, packageId]);

  return (
    <div className="container mt-4">
      <h2 id="assignPackageHeader" className="display-4 fw-bold text-center">Assign Package to Group</h2>

      {/* Package ID Input */}
      <div className="form-group mt-3">
        <label htmlFor="packageIdInput" id="package" className="form-label fw-bold">Package ID</label>
        <input
          id="packageIdInput"
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter Package ID"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
        />
      </div>
      
      {/* Group ID Input */}
      <div className="form-group mt-3">
        <label id="group" htmlFor="groupIdInput" className="form-label fw-bold">Group ID</label>
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
      <button onClick={handleAssignPackage} id="assignPackageButton" className="btn btn-primary btn-lg mt-3">
        Assign Package to Group
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

export default AssignPackageToGroup;
