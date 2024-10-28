import React, { useState } from 'react';
import { getPackageCost } from '../api';
import axios, { AxiosError } from 'axios';

const PackageCost: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [cost, setCost] = useState<any>(null);
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
      <h2>Get Package Cost</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Enter Package ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="includeDependencies"
          checked={includeDependencies}
          onChange={(e) => setIncludeDependencies(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="includeDependencies">Include Dependencies</label>
      </div>
      <button onClick={fetchCost} className="btn btn-info mb-3">Fetch Cost</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {cost && <pre className="bg-light p-3 rounded">{JSON.stringify(cost, null, 2)}</pre>}
    </div>
  );
};

export default PackageCost;
