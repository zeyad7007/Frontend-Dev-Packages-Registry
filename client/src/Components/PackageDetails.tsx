// src/components/PackageDetails.tsx
import React, { useState } from 'react';
import { getPackageById, Package } from '../api';

const PackageDetails: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [packageData, setPackageData] = useState<Package | null>(null);

  const fetchPackage = async () => {
    try {
      const data = await getPackageById(id);
      setPackageData(data);
    } catch (error) {
      console.error("Failed to fetch package details", error);
    }
  };

  return (
    <div className="container">
      <h2>Get Package by ID</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Enter Package ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={fetchPackage} className="btn btn-primary mb-3">Fetch Package</button>
      {packageData && (
        <div className="mt-3">
          <h3>{packageData.metadata.Name}</h3>
          <p>Version: {packageData.metadata.Version}</p>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;
