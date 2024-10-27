// src/components/UploadPackage.tsx
import React, { useState } from 'react';
import { uploadPackage, Package } from '../api';

const UploadPackage: React.FC = () => {
  const [packageData, setPackageData] = useState<Package>({
    metadata: { Name: '', Version: '', ID: '' },
    data: { JSProgram: '' }
  });

  const handleUpload = async () => {
    try {
      const result = await uploadPackage(packageData);
      alert(`Package uploaded with ID: ${result.metadata.ID}`);
    } catch (error) {
      console.error("Failed to upload package", error);
    }
  };

  return (
    <div className="container">
      <h2>Upload Package</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Package Name"
        value={packageData.metadata.Name}
        onChange={(e) => setPackageData({ ...packageData, metadata: { ...packageData.metadata, Name: e.target.value } })}
      />
      <input
        type="text"
        className="form-control my-3"
        placeholder="Package Version"
        value={packageData.metadata.Version}
        onChange={(e) => setPackageData({ ...packageData, metadata: { ...packageData.metadata, Version: e.target.value } })}
      />
      <textarea
        className="form-control my-3"
        placeholder="JS Program"
        value={packageData.data.JSProgram}
        onChange={(e) => setPackageData({ ...packageData, data: { ...packageData.data, JSProgram: e.target.value } })}
      />
      <button onClick={handleUpload} className="btn btn-success">Upload Package</button>
    </div>
  );
};

export default UploadPackage;
