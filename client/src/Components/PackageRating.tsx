import React, { useState } from 'react';
import { getPackageRating } from '../api';
import axios, { AxiosError } from 'axios';
import { Metrics } from '../Interface';

const PackageRating: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [rating, setRating] = useState<Metrics>();
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

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {rating && (
        <div className="bg-light p-3 rounded">
          <h5>Package Rating Details:</h5>
          <ul>
            <li><strong>Bus Factor:</strong> {rating.BusFactor}</li>
            <li><strong>Bus Factor Latency:</strong> {rating.BusFactorLatency}</li>
            <li><strong>Correctness:</strong> {rating.Correctness}</li>
            <li><strong>Correctness Latency:</strong> {rating.CorrectnessLatency}</li>
            <li><strong>Ramp Up:</strong> {rating.RampUp}</li>
            <li><strong>Ramp Up Latency:</strong> {rating.RampUpLatency}</li>
            <li><strong>Responsiveness:</strong> {rating.Responsiveness}</li>
            <li><strong>Responsiveness Latency:</strong> {rating.ResponsivenessLatency}</li>
            <li><strong>License Score:</strong> {rating.LicenseScore}</li>
            <li><strong>License Score Latency:</strong> {rating.LicenseScoreLatency}</li>
            <li><strong>Good Pinning Practice:</strong> {rating.GoodPinningPractice}</li>
            <li><strong>Good Pinning Practice Latency:</strong> {rating.GoodPinningPracticeLatency}</li>
            <li><strong>Pull Request:</strong> {rating.PullRequest}</li>
            <li><strong>Pull Request Latency:</strong> {rating.PullRequestLatency}</li>
            <li><strong>Net Score:</strong> {rating.NetScore}</li>
            <li><strong>Net Score Latency:</strong> {rating.NetScoreLatency}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PackageRating;
