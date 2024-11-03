import React, { useState } from 'react';
import { resetRegistry } from '../api';
import axios, { AxiosError } from 'axios';

const ResetRegistry: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = async () => {
    try {
      await resetRegistry();
      setErrorMessage(null);
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerText = `Registry has been reset successfully.`;
      document.querySelector('.container')?.prepend(successMessage);
      setTimeout(() => successMessage.remove(), 5000);
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
      console.error("Failed to reset registry:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="display-4 fw-bold">Reset Registry</h2> {/* Bold heading */}
      <button className="btn btn-danger btn-lg mt-4" onClick={handleReset} aria-live="polite">
        Reset Registry
      </button>
      {errorMessage && <div className="alert alert-danger" role="alert" aria-live="assertive">{errorMessage}</div>}
    </div>
  );
};

export default ResetRegistry;
