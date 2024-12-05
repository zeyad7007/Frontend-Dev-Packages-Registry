import React from 'react';
import { useNavigate } from 'react-router-dom';
import Authenticate from '../Components/Authenticate';

interface LoginPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  redirectPath: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, redirectPath }) => {
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    // Save the token in localStorage
    localStorage.setItem('authToken', token);

    // Update the authentication state
    setIsAuthenticated(true);

    // Clear the redirect path after successful login
    localStorage.removeItem('redirectPath');

    // Redirect to the intended path
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" data-testid="login-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="display-4 fw-bold text-center mb-4">Login</h2>
        <Authenticate onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
