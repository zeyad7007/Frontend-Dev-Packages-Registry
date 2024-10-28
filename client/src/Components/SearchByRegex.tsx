import React, { useState } from 'react';
import { getPackagesByRegex, Package } from '../api';
import axios, { AxiosError } from 'axios';

const SearchByRegex: React.FC = () => {
  const [regex, setRegex] = useState<string>('');
  const [packages, setPackages] = useState<Package[]>([]);
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
      <h2>Search Packages by Regex</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Enter Regex"
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
      />
      <button onClick={handleSearch} className="btn btn-primary mb-3">Search</button>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="mt-3">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.metadata.ID} className="border rounded p-3 mb-2">
              <h5>{pkg.metadata.Name}</h5>
              <p>Version: {pkg.metadata.Version}</p>
            </div>
          ))
        ) : (
          <p>No packages found</p>
        )}
      </div>
    </div>
  );
};

export default SearchByRegex;
