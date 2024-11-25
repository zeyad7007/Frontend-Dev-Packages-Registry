import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div>
        <h1 className="display-4 fw-bold text-center mb-5">Welcome to Fuwwah Package Registry</h1>
        <div className="d-flex justify-content-center gap-3">
          {/* Button to Login Page */}
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => navigate('/login')}>
            Login
          </button>
          {/* Button to Tracks Page */}
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={() => navigate('/tracks')}>
            Tracks
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
