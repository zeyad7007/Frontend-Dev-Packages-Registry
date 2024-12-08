import React, { useState } from 'react';
import { getPackagesByRegex } from '../api';
import axios, { AxiosError } from 'axios';
import { PackageIR } from '../Interface';

const SearchByRegex: React.FC = () => {
  const [regex, setRegex] = useState<string>('');
  const [packages, setPackages] = useState<PackageIR[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const result = await getPackagesByRegex(regex);
      setPackages(result);
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
      console.error("Failed to search packages by regex", err);
    }
  };

  return (
    <div className="container">
      <h2 className="display-4 fw-bold text-center">Search by Regex</h2> {/* Bold heading */}
      <input
        type="text"
        className="form-control form-control-lg my-3"
        aria-label="Enter Regex"
        placeholder="Enter Regex"
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
      />
      <button onClick={handleSearch} className="btn btn-primary btn-lg mb-3">Search</button>

      {errorMessage && (
        <div id="error"className="alert alert-danger" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      <div className="mt-3" aria-live="polite">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.ID} className="border rounded p-3 mb-2">
              <h5>{pkg.Name}</h5>
              <p>Version: {pkg.Version}</p>
              <p>ID: {pkg.ID}</p>
            </div>
          ))
        ) : (
         null
        )}
      </div>
    </div>
  );
};

export default SearchByRegex;
