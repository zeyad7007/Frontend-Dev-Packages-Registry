import React, { useState } from 'react';
import { getPackageCost } from '../api';
import axios, { AxiosError } from 'axios';
import { CostI } from '../Interface';

const PackageCost: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [cost, setCost] = useState<CostI[]>();
  const [includeDependencies, setIncludeDependencies] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCost = async () => {
    try {
      const result = await getPackageCost(id, includeDependencies);
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
      console.error("Failed to fetch package cost", err);
    }
  };

  return (
    <div className="container">
      <h2 className="display-4 fw-bold text-center">Package Cost</h2>
      <input
        type="text"
        className="form-control form-control-lg my-3"
        aria-label="Enter Package ID"
        placeholder="Enter Package ID"
        id="package-id-input"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="include-dependencies-checkbox"
          aria-label="Include Dependencies"
          checked={includeDependencies}
          onChange={(e) => setIncludeDependencies(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="includeDependencies">Include Dependencies</label>
      </div>
      <button onClick={fetchCost} id="fetch-cost-button" className="btn btn-info btn-lg mb-3">Fetch Cost</button>

      {errorMessage && (
        <div className="alert alert-danger" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {cost && (
        <div className="bg-light p-3 rounded" aria-live="polite">
          <h5>Package Cost Details:</h5>
          {Object.entries(cost).map(([packageId, costDetails]) => (
            <div key={packageId}>
              <h6>Package ID: {packageId}</h6>
              <ul>
                {costDetails.standalonecost !== undefined && (
                  <li><strong>Standalone Cost:</strong> {costDetails.ID.standalonecost} MB</li>
                )}
                <li><strong>Total Cost:</strong> {costDetails.ID.totalcost} MB</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageCost;
