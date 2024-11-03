import React, { useState } from 'react';
import { getPackageById } from '../api';
import { Package } from '../Interface';
import axios, { AxiosError } from 'axios';

const PackageDetails: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPackage = async () => {
    try {
      const data = await getPackageById(id);
      setPackageData(data);
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
      console.error("Failed to fetch package details", err);
    }
  };

  return (
    <div className="container">
      <h2 className="display-4 fw-bold">Package Details</h2> {/* Bold heading */}
      <input
        type="text"
        className="form-control form-control-lg my-3"
        aria-label="Package ID"
        placeholder="Enter Package ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={fetchPackage} className="btn btn-primary btn-lg">Fetch Package</button>

      {errorMessage && (
        <div className="alert alert-danger" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {packageData && (
        <div aria-live="polite">
          <h3>{packageData.metadata.Name} (v{packageData.metadata.Version})</h3>
          <p>ID: {packageData.metadata.ID}</p>
          {packageData.data.URL && (
            <p>URL: <a href={packageData.data.URL} target="_blank" rel="noopener noreferrer">{packageData.data.URL}</a></p>
          )}
          {packageData.data.JSProgram && (
            <div>
              <h4>JavaScript Program:</h4>
              <pre>{packageData.data.JSProgram}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageDetails;