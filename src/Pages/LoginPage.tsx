import React from 'react';
import { useNavigate } from 'react-router-dom';
import Authenticate from '../Components/Authenticate';

interface LoginPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    // Save the token in localStorage
    localStorage.setItem('authToken', token);

    // Update the authentication state
    setIsAuthenticated(true);

    // Redirect to the home page
    navigate('/home');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="display-4 fw-bold text-center mb-4">Login</h2>
        <Authenticate onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
