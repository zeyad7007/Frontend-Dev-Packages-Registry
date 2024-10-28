import React, { useState } from 'react';
import { getPackageRating } from '../api';
import axios, { AxiosError } from 'axios';

const PackageRating: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [rating, setRating] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRating = async () => {
    try {
      const result = await getPackageRating(id);
      setRating(result);
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
      console.error("Failed to fetch package rating", err);
    }
  };

  return (
    <div className="container">
      <h2>Get Package Rating</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Enter Package ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={fetchRating} className="btn btn-info mb-3">Fetch Rating</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {rating && <pre className="bg-light p-3 rounded">{JSON.stringify(rating, null, 2)}</pre>}
    </div>
  );
};

export default PackageRating;
