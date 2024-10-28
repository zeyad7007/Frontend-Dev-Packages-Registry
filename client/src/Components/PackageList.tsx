import React, { useEffect, useState, useCallback } from 'react';
import { getPackages, Package } from '../api';
import axios, { AxiosError } from 'axios';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [queries, setQueries] = useState<{ Name: string; Version: string }[]>([
    { Name: '', Version: '' },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    if (offset < 0) {
      setErrorMessage('Offset cannot be negative.');
      return;
    }
    try {
      const query = queries.filter(q => q.Name || q.Version); // Filter out empty queries
      const result = await getPackages(offset, query);
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

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleAddQuery = () => {
    setQueries([...queries, { Name: '', Version: '' }]);
  };

  const handleRemoveQuery = (index: number) => {
    setQueries(queries.filter((_, i) => i !== index));
  };

  const handleQueryChange = (index: number, field: 'Name' | 'Version', value: string) => {
    const newQueries = [...queries];
    newQueries[index][field] = value;
    setQueries(newQueries);
  };

  return (
    <div className="container">
      <h2>Package List</h2>
      <div className="form-group">
        {queries.map((query, index) => (
          <div key={index} className="query-group mb-3">
            <input
              type="text"
              className="form-control my-2"
              placeholder="Enter Package Name (optional)"
              value={query.Name}
              onChange={(e) => handleQueryChange(index, 'Name', e.target.value)}
            />
            <input
              type="text"
              className="form-control my-2"
              placeholder="Enter Version (e.g., Exact (1.2.3), Bounded range (1.2.3-2.1.0), Carat (^1.2.3), Tilde (~1.2.0))"
              value={query.Version}
              onChange={(e) => handleQueryChange(index, 'Version', e.target.value)}
            />
            <button
              className="btn btn-danger mb-3"
              onClick={() => handleRemoveQuery(index)}
              disabled={queries.length === 1} // Prevent removing the last remaining query
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddQuery} className="btn btn-secondary mb-3">
          Add Another Query
        </button>
      </div>
      <input
        type="number"
        className="form-control my-3"
        placeholder="Enter Offset (for pagination)"
        value={offset}
        onChange={(e) => setOffset(Number(e.target.value))}
      />
      <button onClick={fetchPackages} className="btn btn-primary mb-3">Load Packages</button>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {packages.map((pkg) => (
        <div key={pkg.metadata.ID} className="border rounded p-3 mb-2">
          <h5>{pkg.metadata.Name}</h5>
          <p>Version: {pkg.metadata.Version}</p>
        </div>
      ))}
    </div>
  );
};

export default PackageList;
