import React, { useState } from 'react';
import { getPackageCost } from '../api';
import axios, { AxiosError } from 'axios';
import { CostFullData, Dependency } from '../Interface';

const PackageCost: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [cost, setCost] = useState<CostFullData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCost = async () => {
    try {
      const result = await getPackageCost(id);
      setCost(result);
      setErrorMessage(null);
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
      console.error('Failed to fetch package cost', err);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Package Cost Calculator</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="package-id-input" className="form-label">
            Enter Package ID
          </label>
          <input
            type="text"
            className="form-control"
            id="package-id-input"
            value={id}
            placeholder="e.g., 123"
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <button onClick={fetchCost} className="btn btn-primary w-100">
          Fetch Cost
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {cost && (
        <div className="card mt-4 p-4 shadow-sm">
          <h4>Package Cost Details</h4>
          <hr />
          <p>
            <strong>Package ID:</strong> {cost.dependencies.id}
          </p>
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>Dependency</th>
                <th>Standalone Cost (MB)</th>
                <th>Total Cost (MB)</th>
              </tr>
            </thead>
            <tbody>
              {cost.dependencies.Dependencies.map((dependency: Dependency, index) => (
                <tr key={index}>
                  <td>{dependency.Dependency}</td>
                  <td>{dependency.StandaloneCost !== undefined ? dependency.StandaloneCost : 'N/A'}</td>
                  <td>{dependency.TotalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PackageCost;
