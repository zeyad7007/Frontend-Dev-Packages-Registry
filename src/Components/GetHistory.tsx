import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { getHistory } from '../api';
import { PackageHistoryI, PackageHistoryBodyI } from '../Interface';

const GetPackageHistory: React.FC = () => {
  const [packageId, setPackageId] = useState<number | ''>(''); // State for package ID input
  const [history, setHistory] = useState<PackageHistoryI[] | null>(null); // State for package history
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages

  // Fetch package history API call
  const fetchHistory = useCallback(async () => {
    if (!packageId || typeof packageId !== 'number') {
      setErrorMessage('Package ID is required and must be a number.');
      setSuccessMessage(null);
      setHistory(null);
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setHistory(null);

      const body: PackageHistoryBodyI = { id: packageId };

      // Make the API call
      const response = await getHistory(body);
      setHistory(response);
      setSuccessMessage('Successfully fetched package history.');
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

      setHistory(null); // Reset history on error
    }
  }, [packageId]);

  return (
    <div className="container mt-4">
      <h2 className="display-4 fw-bold text-center">Get Package History</h2>

      {/* Package ID Input */}
      <div className="form-group mt-3">
        <label htmlFor="packageIdInput" className="form-label fw-bold">Package ID</label>
        <input
          id="packageIdInput"
          type="number"
          className="form-control form-control-lg"
          placeholder="Enter Package ID"
          value={packageId}
          onChange={(e) => setPackageId(Number(e.target.value) || '')}
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
      {history && (
        <div className="border rounded p-3 mt-3">
          <h4>Package History:</h4>
          <ul className="list-unstyled">
            {history.map((entry) => (
              <li key={entry.id} className="mb-2">
                <strong>Action:</strong> {entry.action} <br />
                <strong>Action Date:</strong> {new Date(entry.action_date).toLocaleString()} <br />
                <strong>User ID:</strong> {entry.user_id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetPackageHistory;
