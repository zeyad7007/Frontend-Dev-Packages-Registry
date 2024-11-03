import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PackageList from './Components/PackageList';
import ResetRegistry from './Components/ResetRegistry';
import SearchByRegex from './Components/SearchByRegex';
import PackageDetails from './Components/PackageDetails';
import UploadPackage from './Components/UploadPackage';
import UpdatePackage from './Components/UpdatePackage';
import PackageRating from './Components/PackageRating';
import PackageCost from './Components/PackageCost';
import Tracks from './Components/Tracks';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <h1 className="display-1 text-center mt-5 fw-bold">ECE 461 Project API Interface</h1>
        <div className="mt-4">
          <div className="d-flex flex-wrap justify-content-around mb-4" role="navigation" aria-label="Main Navigation">
            <Link to="/packages" className="btn btn-primary btn-lg m-2">Get Packages</Link>
            <Link to="/reset" className="btn btn-danger btn-lg m-2">Reset Registry</Link>
            <Link to="/package" className="btn btn-secondary btn-lg m-2">Get Package by ID</Link>
            <Link to="/update-package" className="btn btn-warning btn-lg m-2">Update Package by ID</Link>
            <Link to="/upload" className="btn btn-success btn-lg m-2">Upload Package</Link>
            <Link to="/package-rating" className="btn btn-info btn-lg m-2">Get Package Rating</Link>
            <Link to="/package-cost" className="btn btn-info btn-lg m-2">Get Package Cost</Link>
            <Link to="/search" className="btn btn-primary btn-lg m-2">Search by Regex</Link>
            <Link to="/tracks" className="btn btn-secondary btn-lg m-2">Get Tracks</Link>
          </div>
          <main>
            <Routes>
              <Route path="/packages" element={<PackageList />} />
              <Route path="/reset" element={<ResetRegistry />} />
              <Route path="/package" element={<PackageDetails />} />
              <Route path="/update-package" element={<UpdatePackage />} />
              <Route path="/upload" element={<UploadPackage />} />
              <Route path="/package-rating" element={<PackageRating />} />
              <Route path="/package-cost" element={<PackageCost />} />
              <Route path="/search" element={<SearchByRegex />} />
              <Route path="/tracks" element={<Tracks />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
