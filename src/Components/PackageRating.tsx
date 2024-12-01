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
      <h2 className="display-4 fw-bold text-center">Package Rating</h2> {/* Bold heading */}
      <input
        type="text"
        className="form-control form-control-lg my-3"
        aria-label="Enter Package ID"
        placeholder="Enter Package ID"
        id="package-id-input"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={fetchRating} id="fetch-rating-button" className="btn btn-info btn-lg mb-3">Fetch Rating</button>

      {errorMessage && (
        <div className="alert alert-danger" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {rating && (
        <div className="bg-light p-3 rounded" aria-live="polite">
          <h5>Package Rating Details:</h5>
          <ul>
            
            <li><strong>Bus Factor:</strong><br />Score: {rating.BusFactor}<br />Latency: {rating.BusFactorLatency}ms</li>
            <li><strong>Correctness:</strong><br />Score: {rating.Correctness}<br />Latency: {rating.CorrectnessLatency}ms</li>
            <li><strong>Ramp Up:</strong><br />Score: {rating.RampUp}<br />Latency: {rating.RampUpLatency}ms</li>
            <li><strong>Responsiveness:</strong><br />Score: {rating.Responsiveness}<br />Latency: {rating.ResponsivenessLatency}ms</li>
            <li><strong>License Score:</strong><br />Score: {rating.LicenseScore}<br />Latency: {rating.LicenseScoreLatency}ms</li>
            <li><strong>Good Pinning Practice:</strong><br />Score: {rating.GoodPinningPractice}<br />Latency: {rating.GoodPinningPracticeLatency}ms</li>
            <li><strong>Pull Request:</strong><br />Score: {rating.PullRequest}<br />Latency: {rating.PullRequestLatency}ms</li>
            <li><strong>Net Score:</strong><br />Score: {rating.NetScore}<br />Latency: {rating.NetScoreLatency}ms</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PackageRating;
