import React, { useState } from 'react';
import { logout } from '../api';
import axios, { AxiosError } from 'axios';

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout })  => {
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const fetchLogout = async () => {
        try {
        const result = await logout();
        setMessage(result);
        onLogout();
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
        console.error("Failed to fetch logout", err);
        }
    };
    
    return (
        <div className="container">
        <div className="d-flex justify-content-center">
            <button onClick={fetchLogout} id="fetch-logout-button" className="btn btn-danger btn-lg mt-3">Logout</button>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        </div>
    );
    }

export default Logout;