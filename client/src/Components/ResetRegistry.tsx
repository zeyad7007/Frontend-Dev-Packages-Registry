import React from 'react';
import { resetRegistry } from '../api';
import axios, { AxiosError } from 'axios';

const ResetRegistry: React.FC = () => {
  const handleReset = async () => {
    try {
      await resetRegistry();
      alert("Registry has been reset.");
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

        alert(`Error ${statusCode}: ${errorMessage}`);
      } else {
        alert('An unexpected error occurred.');
      }
      console.error("Failed to reset registry:", err);
    }
  };

  return (
    <div className="container">
      <h2>Reset Registry</h2>
      <button className="btn btn-danger mt-4" onClick={handleReset}>
        Reset Registry
      </button>
    </div>
  );
};

export default ResetRegistry;
