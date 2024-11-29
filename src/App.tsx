import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import Tracks from './Components/Tracks';
import AdminActions from './Pages/AdminPage';
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route
          path="/home/*"
          element={
            isAuthenticated ? (
              <HomePage setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/tracks" element={<Tracks />} />

        <Route path="/admin-actions/*" element={<AdminActions />} />
      </Routes>
    </Router>
  );
};

export default App;
