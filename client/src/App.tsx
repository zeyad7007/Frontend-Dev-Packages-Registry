import React, { useState } from 'react';
import { getData, postData, deleteData } from './api';
import { PackageData, PackageMetadata, RegexQuery } from './Types';
import Button from './Components/Button';
import Alert from './Components/Alert';
import List from './Components/List';
import axios, { AxiosError } from 'axios';

const App: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: string | File | null }>({});
  const [response, setResponse] = useState<PackageData[] | PackageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle button click and set the active endpoint
  const handleButtonClick = (endpoint: string) => {
    setActiveEndpoint(endpoint);
    setResponse(null);
    setError(null);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setInputs({ ...inputs, [name]: files[0] });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  // Handle form submission and make API calls
  const handleSubmit = async () => {
    try {
      setError(null);
      setResponse(null);
      let res;

      if (activeEndpoint) {
        const endpoint = activeEndpoint.replace(':id', inputs.id as string || '');

        switch (activeEndpoint) {
          case '/packages':
            res = await postData<RegexQuery>(endpoint, { RegEx: '*' });
            break;

          case '/reset':
            res = await deleteData<object>(endpoint);
            break;

          case '/package/:id':
            res = await getData<PackageData>(endpoint);
            break;

          case '/package/byRegEx': {
            const regexPayload: RegexQuery = { RegEx: inputs.RegEx as string };
            res = await postData<RegexQuery>(endpoint, regexPayload);
            break;
          }

          case '/package': {
            let contentBase64: string | undefined = undefined;

            // If a file is uploaded, convert it to Base64
            if (inputs.Content instanceof File) {
              contentBase64 = await convertFileToBase64(inputs.Content);
            }

            // Build the package data payload
            const packageData = {
              Name: inputs.Name as string,
              Content: contentBase64,
              URL: inputs.URL ? (inputs.URL as string) : undefined,
              debloat: inputs.Debloat ? (inputs.Debloat as string) : undefined,
              JSProgram: inputs.JSProgram ? (inputs.JSProgram as string) : undefined,
            };

            res = await postData<typeof packageData>(endpoint, packageData);
            break;
          }

          case '/package/:id/rate':
          case '/package/:id/cost':
            res = await getData<PackageData>(endpoint);
            break;

          case '/tracks':
            res = await getData<PackageMetadata[]>(endpoint);
            break;

          default:
            throw new Error('Invalid endpoint');
        }
        console.log(res.data);
        if (res) {
          setResponse(res);
        }
      }
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

        setError(`Error ${statusCode}: ${errorMessage}`);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  // Helper function to convert a File to a Base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file); // Read as text since it is Base64 encoded
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Render the response from the API
  const renderResponse = () => {
    if (!response) return null;

    if (Array.isArray(response)) {
      return (
        <List
          items={response.map((pkg: PackageData) => ({
            label: `Package Name: ${pkg.metadata.Name}`,
            value: `Version: ${pkg.metadata.Version}, ID: ${pkg.metadata.ID}`,
          }))}
        />
      );
    }

    if ('metadata' in response) {
      const pkg = response as PackageData;

      const handleDownloadContent = () => {
        if (pkg.data.Content) {
          const byteCharacters = atob(pkg.data.Content);
          const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/zip' });

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${pkg.metadata.Name || 'download'}.zip`;
          link.click();
        }
      };

      return (
        <div className="mt-3">
          <h5>Response</h5>
          <div className="border rounded p-3 mb-2">
            <h5>Package Name: {pkg.metadata.Name}</h5>
            <p>Version: {pkg.metadata.Version}</p>
            <p>ID: {pkg.metadata.ID}</p>

            {pkg.data.Content && (
              <div>
                <button onClick={handleDownloadContent} className="btn btn-secondary">
                  Download Content as ZIP
                </button>
              </div>
            )}

            {pkg.data.JSProgram && (
              <div>
                <h6>JavaScript Program:</h6>
                <pre>{pkg.data.JSProgram}</pre>
              </div>
            )}

            {pkg.data.URL && (
              <div>
                <h6>URL:</h6>
                <a href={pkg.data.URL} target="_blank" rel="noopener noreferrer">
                  {pkg.data.URL}
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container">
      <h1>ECE 461 Package Registry</h1>
      <div className="btn-group mb-3">
        <Button label="Get Packages" onClick={() => handleButtonClick('/packages')} />
        <Button label="Reset Registry" onClick={() => handleButtonClick('/reset')} />
        <Button label="Get Package by ID" onClick={() => handleButtonClick('/package/:id')} />
        <Button label="Upload Package" onClick={() => handleButtonClick('/package')} />
        <Button label="Get Package Rating by ID" onClick={() => handleButtonClick('/package/:id/rate')} />
        <Button label="Get Package Cost by ID" onClick={() => handleButtonClick('/package/:id/cost')} />
        <Button label="Get Tracks" onClick={() => handleButtonClick('/tracks')} />
        <Button label="Search by Regex" onClick={() => handleButtonClick('/package/byRegEx')} />
      </div>

      {activeEndpoint && (
        <div className="form-group mb-3">
          <h4>{`Active Endpoint: ${activeEndpoint}`}</h4>
          {activeEndpoint.includes(':id') && (
            <input
              type="text"
              name="id"
              placeholder="Enter Package ID"
              onChange={handleChange}
              className="form-control"
            />
          )}
          {activeEndpoint === '/package/byRegEx' && (
            <input
              type="text"
              name="RegEx"
              placeholder="Enter Regex"
              onChange={handleChange}
              className="form-control"
            />
          )}
          {activeEndpoint === '/package' && (
            <>
              <input
                type="text"
                name="Name"
                placeholder="Enter Package Name"
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="file"
                name="Content"
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="URL"
                placeholder="Enter GitHub Repo URL"
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="Debloat"
                placeholder="Enter Debloat Status"
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                name="JSProgram"
                placeholder="Enter JavaScript Program"
                onChange={handleChange}
                className="form-control mb-2"
              />
            </>
          )}
          <Button label="Submit" onClick={handleSubmit} />
        </div>
      )}

      {error && <Alert message={error} type="error" />}
      

      {renderResponse()}
    </div>
  );
};

export default App;
