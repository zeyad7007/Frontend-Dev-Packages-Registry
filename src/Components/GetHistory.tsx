import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { getHistory } from '../api'; // API function to fetch package history
import { PackageHistoryI } from '../Interface'; // Interface for the package history response

const GetPackageHistory: React.FC = () => {
  const [packageId, setPackageId] = useState<string>(''); // State for package ID input
  const [packageHistory, setPackageHistory] = useState<PackageHistoryI[]>([]); // State for package history
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  // Fetch package history API call
  const fetchHistory = useCallback(async () => {
    const parsedPackageId = parseInt(packageId, 10);
    if (isNaN(parsedPackageId)) {
      setErrorMessage('Package ID must be a valid number.');
      setSuccessMessage(null);
      setPackageHistory([]);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setPackageHistory([]);

      // API call to fetch history
      const response = await getHistory(parsedPackageId);
      setPackageHistory(response); // Update state with response
      setSuccessMessage('Package history fetched successfully.');
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

      setPackageHistory([]); // Reset state on error
    }
  }, [packageId]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold">Get Package History</h2>

      {/* Package ID Input */}
      <div className="form-group mt-3">
        <label htmlFor="packageIdInput" className="form-label fw-bold">Package ID</label>
        <input
          id="packageIdInput"
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter Package ID"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button onClick={fetchHistory} className="btn btn-primary btn-lg mt-3">
        Fetch History
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

      {/* History Display */}
      {packageHistory.length > 0 && (
        <div className="mt-4">
          <h4>Package History:</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Package ID</th>
                <th>User ID</th>
                <th>Action</th>
                <th>Action Date</th>
              </tr>
            </thead>
            <tbody>
              {packageHistory.map((history) => (
                <tr key={history.id}>
                  <td>{history.id}</td>
                  <td>{history.package_id}</td>
                  <td>{history.user_id}</td>
                  <td>{history.action}</td>
                  <td>{new Date(history.action_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetPackageHistory;
