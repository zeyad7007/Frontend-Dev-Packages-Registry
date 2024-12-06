import React, { useState } from 'react';
import { authenticate } from '../api';
import { AuthenticateI } from '../Interface';
import axios, { AxiosError } from 'axios';


interface AuthenticateProps {
  onLogin: (token: string) => void;
}

const Authenticate: React.FC<AuthenticateProps> = ({ onLogin })  => {
  const [credentials, setCredentials] = useState<AuthenticateI>({User:{name:'',isAdmin:false},Secret:{password:''}});
  const [token, setToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const fetchAuthenticate = async () => {
    try {
      const result = await authenticate(credentials);
      console.log(result);
      setToken(result);
      onLogin(result);
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
      console.error("Failed to fetch authenticate", err);
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        className="form-control form-control-lg my-3"
        aria-label="Enter Username"
        placeholder="Enter Username"
        id="username-input"
        value={credentials.User.name}
        onChange={(e) => setCredentials({...credentials, User:{name:e.target.value,isAdmin:false}})}
      />
      <input
        type="password"
        className="form-control form-control-lg my-3"
        aria-label="Enter Password"
        placeholder="Enter Password"
        id="password-input"
        value={credentials.Secret.password}
        onChange={(e) => setCredentials({...credentials, Secret:{password:e.target.value}})}
      />
      <div className="d-flex justify-content-center">
        <button 
          onClick={fetchAuthenticate} 
          id="authenticate-button" 
          className="btn btn-info btn-lg mb-3">
          Login
        </button>
      </div>

      {token && (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Authenticated!</h4>
          <p>
            {credentials.User.name} is authenticated.
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>
            {errorMessage}
            </p>
        </div>
        )}
    </div>
    );
};

export default Authenticate;
