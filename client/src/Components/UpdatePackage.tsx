import React, { useState } from 'react';
import { updatePackageById, PackageUpdateI } from '../api';
import axios, { AxiosError } from 'axios';

const UpdatePackage: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [packageData, setPackageData] = useState<PackageUpdateI>({
    metadata: {
      Name: '',
      Version: ''
    },
    data: {
      Content: undefined,
      URL: undefined,
      JSProgram: '',
      debloat: false
    }
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPackageData({
            ...packageData,
            data: {
              ...packageData.data,
              Content: btoa(reader.result as string),
              URL: undefined
            }
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleUpdate = async () => {
    
    try {
      await updatePackageById(id, packageData);
      setErrorMessage(null);
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerText = 'Package updated successfully.';
      document.querySelector('.container')?.prepend(successMessage);
      setTimeout(() => successMessage.remove(), 5000);
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
      console.error("Failed to update package", err);
    }
  };

  return (
    <div className="container">
      <h2>Update Package by ID</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Enter Package ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        className="form-control my-3"
        placeholder="Package Name"
        value={packageData.metadata.Name}
        onChange={(e) => setPackageData({
          ...packageData,
          metadata: { ...packageData.metadata, Name: e.target.value }
        })}
      />
      <input
        type="text"
        className="form-control my-3"
        placeholder="Package Version"
        value={packageData.metadata.Version}
        onChange={(e) => setPackageData({
          ...packageData,
          metadata: { ...packageData.metadata, Version: e.target.value }
        })}
      />
      <div className="form-check my-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="debloat"
          checked={packageData.data.debloat}
          onChange={(e) => setPackageData({
            ...packageData,
            data: { ...packageData.data, debloat: e.target.checked }
          })}
        />
        <label className="form-check-label" htmlFor="debloat">Debloat</label>
      </div>
      <textarea
        className="form-control my-3"
        placeholder="JS Program"
        value={packageData.data.JSProgram}
        onChange={(e) => setPackageData({
          ...packageData,
          data: { ...packageData.data, JSProgram: e.target.value }
        })}
      />
      <input
        type="text"
        className="form-control my-3"
        placeholder="GitHub Repo URL (optional)"
        value={packageData.data.URL || ''}
        onChange={(e) => setPackageData({
          ...packageData,
          data: { ...packageData.data, URL: e.target.value, Content: undefined }
        })}
      />
      <input
        type="file"
        className="form-control my-3"
        onChange={handleFileChange}
      />
      <button onClick={handleUpdate} className="btn btn-warning">Update Package</button>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default UpdatePackage;