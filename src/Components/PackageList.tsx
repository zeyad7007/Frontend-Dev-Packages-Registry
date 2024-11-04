import React, { useState, useCallback } from 'react';
import { getPackages } from '../api';
import axios, { AxiosError } from 'axios';
import { PackageListI } from '../Interface';

let flag=0;

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<PackageListI[]>([]);
  const [offset, setOffset] = useState<string>(''); // Use a string to allow empty state
  const [queries, setQueries] = useState<{ Name: string; Version: string }[]>([
    { Name: '', Version: '' },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    const parsedOffset = parseInt(offset);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      setErrorMessage('Offset must be a non-negative number.');
      return;
    }

    try {
      flag=1;
      const query = queries.filter(q => q.Name || q.Version); // Filter out empty queries
      const result = await getPackages(parsedOffset, query);
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
      console.error("Failed to fetch packages", err);
    }
  }, [offset, queries]);

  const handleAddQuery = () => {
    setQueries(prevQueries => [...prevQueries, { Name: '', Version: '' }]);
  };

  const handleRemoveQuery = (index: number) => {
    setQueries(prevQueries => prevQueries.filter((_, i) => i !== index));
  };

  const handleQueryChange = (index: number, field: 'Name' | 'Version', value: string) => {
    setQueries(prevQueries => {
      const newQueries = [...prevQueries];
      newQueries[index] = { ...newQueries[index], [field]: value };
      return newQueries;
    });
  };

  return (
    <div className="container">
      <h2 className="display-4 fw-bold">Package List</h2> {/* Bold and large heading */}
      <div className="form-group">
        {queries.map((query, index) => (
          <div key={index} className="query-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg my-2"
              aria-label="Enter Package Name"
              placeholder="Enter Package Name"
              value={query.Name}
              onChange={(e) => handleQueryChange(index, 'Name', e.target.value)}
            />
            <input
              type="text"
              className="form-control form-control-lg my-2"
              aria-label="Enter Version"
              placeholder="Enter Version"
              value={query.Version}
              onChange={(e) => handleQueryChange(index, 'Version', e.target.value)}
            />
            <button
              className="btn btn-danger btn-lg mb-3"
              onClick={() => handleRemoveQuery(index)}
              disabled={queries.length === 1} // Prevent removing the last remaining query
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddQuery} className="btn btn-secondary btn-lg mb-3">
          Add Another Query
        </button>
      </div>
      <div className="form-group">
        <label htmlFor="offsetInput" className="display-4 fw-bold form-label form-control-lg mb-1">Enter Offset (for pagination)</label>
        <input
          id="offsetInput"
          type="number"
          className="form-control form-control-lg my-2"
          placeholder="Enter Offset"
          value={offset}
          onChange={(e) => setOffset(e.target.value)}
        />
      </div>
      <button id= "Load" onClick={fetchPackages} className="btn btn-primary btn-lg mb-3">Load Packages</button>

      {errorMessage && <div className="alert alert-danger" role="alert" aria-live="assertive">{errorMessage}</div>}

      <div className="mt-3" aria-live="polite">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.id} className="border rounded p-3 mb-2">
              <h5>{pkg.name}</h5>
              <p>Version: {pkg.version}</p>
            </div>
          ))
        ) : (
          (packages.length === 0 && flag) ? (
            <p>No packages found</p>
          ) : null
        )}
      </div>
    </div>
  );
};

export default PackageList;
