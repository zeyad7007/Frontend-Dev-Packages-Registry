import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import PackageList from '../Components/PackageList';
import ResetRegistry from '../Components/ResetRegistry';
import PackageDetails from '../Components/PackageDetails';
import UpdatePackage from '../Components/UpdatePackage';
import UploadPackage from '../Components/UploadPackage';
import PackageRating from '../Components/PackageRating';
import PackageCost from '../Components/PackageCost';
import SearchByRegex from '../Components/SearchByRegex';
import Logout from '../Components/Logout';

interface HomePageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomePage: React.FC<HomePageProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const goToLandingPage = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-1 fw-bold" id="fuwwah">
          Fuwwah Package Registry
        </h1>
        <p className="lead mt-3">Welcome! Use the options below to interact with the package registry.</p>
      </div>

      <div
        className="d-flex flex-wrap justify-content-around mt-5"
        role="navigation"
        aria-label="Home Navigation"
      >
        <Link to="packages" className="btn btn-primary btn-lg m-2">
          Get Packages
        </Link>
        <Link to="reset" className="btn btn-danger btn-lg m-2">
          Reset Registry
        </Link>
        <Link to="package" className="btn btn-secondary btn-lg m-2">
          Get Package by ID
        </Link>
        <Link to="update-package" className="btn btn-warning btn-lg m-2">
          Update Package by ID
        </Link>
        <Link to="upload" className="btn btn-success btn-lg m-2">
          Upload Package
        </Link>
        <Link to="package-rating" className="btn btn-info btn-lg m-2">
          Get Package Rating
        </Link>
        <Link to="package-cost" className="btn btn-info btn-lg m-2">
          Get Package Cost
        </Link>
        <Link to="search" className="btn btn-primary btn-lg m-2">
          Search by Regex
        </Link>
      </div>

      <Routes>
        <Route path="packages" element={<PackageList />} />
        <Route path="reset" element={<ResetRegistry />} />
        <Route path="package" element={<PackageDetails />} />
        <Route path="update-package" element={<UpdatePackage />} />
        <Route path="upload" element={<UploadPackage />} />
        <Route path="package-rating" element={<PackageRating />} />
        <Route path="package-cost" element={<PackageCost />} />
        <Route path="search" element={<SearchByRegex />} />
      </Routes>

      <div className="d-flex flex-column align-items-center mt-5">
        <button
          className="btn btn-secondary btn-lg mb-3"
          onClick={() => navigate('/admin-actions')}
        >
          Admin Actions
        </button>

        <button
          className="btn btn-dark btn-lg mb-3"
          onClick={goToLandingPage}
        >
          Back to Landing Page
        </button>

        <div className="d-flex justify-content-center">
          <Logout onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
