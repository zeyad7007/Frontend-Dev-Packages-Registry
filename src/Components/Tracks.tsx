import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTracks } from '../api';
import axios, { AxiosError } from 'axios';

const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const result = await getTracks();
        setTracks(result);
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
        console.error('Failed to fetch tracks', err);
      }
    };
    fetchTracks();
  }, []);

  const goToLandingPage = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h2 className="display-4 fw-bold text-center">Planned Tracks</h2>
      {errorMessage && (
        <div
          id="planned-tracks-error"
          className="alert alert-danger"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      )}
      <ul aria-live="polite" className="list-group list-group-flush">
        {tracks.map((track, index) => (
          <li key={index} className="list-group-item fs-4">
            {track}
          </li>
        ))}
      </ul>

      <div className="text-center mt-5">
        <button
          className="btn btn-dark btn-lg"
          onClick={goToLandingPage}
        >
          Back to Landing Page
        </button>
      </div>
    </div>
  );
};

export default Tracks;
