import React, { useState } from 'react';
import { uploadPackage, PackageUploadI } from '../api';
import axios, { AxiosError } from 'axios';

const UploadPackage: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageUploadI>({
    Name: '',
    JSProgram: '',
    Content: undefined,
    URL: undefined,
    debloat: false
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPackageData({ ...packageData, Content: btoa(reader.result as string), URL: undefined });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleUpload = async () => {
    try {
      const result = await uploadPackage(packageData);
      setErrorMessage(null);
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerText = `Package uploaded with ID: ${result.metadata.ID}`;
      document.querySelector('.container')?.prepend(successMessage);
      setTimeout(() => successMessage.remove(), 5000);
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
      console.error("Failed to upload package", err);
    }
  };

  return (
    <div className="container">
      <h2>Upload Package</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Package Name"
        value={packageData.Name}
        onChange={(e) => setPackageData({ ...packageData, Name: e.target.value })}
      />
      <div className="form-check my-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="debloat"
          checked={packageData.debloat}
          onChange={(e) => setPackageData({ ...packageData, debloat: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="debloat">Debloat</label>
      </div>
      <textarea
        className="form-control my-3"
        placeholder="JS Program"
        value={packageData.JSProgram}
        onChange={(e) => setPackageData({ ...packageData, JSProgram: e.target.value })}
      />
      <input
        type="text"
        className="form-control my-3"
        placeholder="GitHub Repo URL"
        value={packageData.URL}
        onChange={(e) => setPackageData({ ...packageData, URL: e.target.value, Content: undefined })}
      />
      <input
        type="file"
        className="form-control my-3"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} className="btn btn-success">Upload Package</button>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default UploadPackage;