// import React, { useState } from 'react';
// import { getData, postData, deleteData } from '../api';
// import { PackageData, PackageMetadata, QueryParams, APIResponse, RegexQuery, PackageRating, PackageCost } from '../Types';
// import axios, { AxiosError } from 'axios';

// interface APIHandlerProps {
//   endpoint: string;
//   title: string;
//   method: 'GET' | 'POST' | 'DELETE';
//   fields?: { label: string; name: string; type: string }[];
// }

// const APIHandler: React.FC<APIHandlerProps> = ({ endpoint, title, method, fields = [] }) => {
//   const [inputs, setInputs] = useState<QueryParams>({});
//   const [response, setResponse] = useState<PackageData | PackageMetadata[] | PackageRating | PackageCost | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputs({ ...inputs, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       setError(null);
//       setResponse(null); // Reset response before making a request
//       const url = endpoint.replace(':id', inputs.id as string || '');
//       let res: APIResponse<PackageData | PackageMetadata[] | PackageRating | PackageCost> | null = null;

//       if (method === 'GET') {
//         console.log('GET request to:', url);
//         res = await getData<PackageData | PackageMetadata[] | PackageRating | PackageCost>(url, inputs);
//       } else if (method === 'POST') {
//         console.log('POST request payload:', inputs);

//         if (endpoint === '/package/byRegEx') {
//           // Special case for /package/byRegEx endpoint
//           const regexPayload: RegexQuery = {
//             RegEx: inputs.RegEx as string,
//           };
//           res = await postData<RegexQuery>(url, regexPayload);
//         } else {
//           // For other POST endpoints, use inputs directly
//           res = await postData<QueryParams>(url, inputs);
//         }

//         console.log('POST response:', res);
//       } else if (method === 'DELETE') {
//         res = await deleteData<PackageData | PackageMetadata[] | PackageRating | PackageCost>(url);
//       }

//       if (res && res.data) {
//         console.log('Setting response data:', res.data);
//         setResponse(res.data);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const axiosError = err as AxiosError;

//         const statusCode = axiosError.response?.status || 'Unknown status code';
//         const errorData = axiosError.response?.data;

//         let errorMessage = '';
//         if (errorData && typeof errorData === 'object') {
//           errorMessage = (errorData as { error?: string }).error || axiosError.message;
//         } else {
//           errorMessage = axiosError.message;
//         }

//         setError(`Error ${statusCode}: ${errorMessage}`);
//       } else {
//         setError('An unexpected error occurred.');
//       }
//     }
//   };

//   return (
//     <div className="container">
//       <h2>{title}</h2>
//       {fields.map((field) => (
//         <div key={field.name} className="mb-3">
//           <label>{field.label}</label>
//           <input
//             type={field.type}
//             name={field.name}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>
//       ))}
//       <button onClick={handleSubmit} className="btn btn-primary mb-3">
//         Submit
//       </button>

//       {/* Render the error if present */}
//       {error && (
//         <div className="alert alert-danger mt-3">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Conditional Rendering Based on Endpoint */}
//       {response && (
//         <div className="mt-3">
//           <h5>Response</h5>
//           {(() => {
//             if (endpoint === '/package/byRegEx' || endpoint === '/packages' || endpoint === '/tracks') {
//               if (Array.isArray(response)) {
//                 return response.map((pkg: PackageMetadata, index: number) => (
//                   <div key={index} className="border rounded p-3 mb-2">
//                     <h5>Package Name: {pkg.Name}</h5>
//                     <p>Version: {pkg.Version}</p>
//                     <p>ID: {pkg.ID}</p>
//                   </div>
//                 ));
//               } else {
//                 return <p>No results found</p>;
//               }
              
//             }

//             if (endpoint === '/package/:id' && 'metadata' in response && 'data' in response) {
//               const packageData = response as PackageData;
//               return (
//                 <div className="border rounded p-3 mb-2">
//                   <h5>Package Metadata</h5>
//                   <p>Name: {packageData.metadata.Name}</p>
//                   <p>Version: {packageData.metadata.Version}</p>
//                   <p>ID: {packageData.metadata.ID}</p>
//                   <h5>Package Data</h5>
//                   {packageData.data.Content && (
//                     <div>
//                       <h6>Content:</h6>
//                       <pre>{packageData.data.Content}</pre>
//                     </div>
//                   )}
//                   {packageData.data.JSProgram && (
//                     <div>
//                       <h6>JavaScript Program:</h6>
//                       <pre>{packageData.data.JSProgram}</pre>
//                     </div>
//                   )}
//                   {packageData.data.URL && (
//                     <div>
//                       <h6>URL:</h6>
//                       <a href={packageData.data.URL} target="_blank" rel="noopener noreferrer">
//                         {packageData.data.URL}
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             if (endpoint === '/package' && 'metadata' in response) {
//               const packageData = response as PackageData;
//               return (
//                 <div className="border rounded p-3 mb-2">
//                   <h5>Package Uploaded/Updated Successfully</h5>
//                   <p>Package Name: {packageData.metadata.Name}</p>
//                   <p>Version: {packageData.metadata.Version}</p>
//                   <p>ID: {packageData.metadata.ID}</p>
//                 </div>
//               );
//             }

//             if (endpoint === '/reset') {
//               return <div className="alert alert-success">Registry has been reset successfully.</div>;
//             }

//             if (endpoint === '/package/:id/rate' && typeof response === 'object') {
//               const ratingData = response as PackageRating;
//               return (
//                 <div className="border rounded p-3 mb-2">
//                   <h5>Package Rating</h5>
//                   {Object.keys(ratingData).map((key) => (
//                     <p key={key}>
//                       {key}: {ratingData[key as keyof PackageRating]}
//                     </p>
//                   ))}
//                 </div>
//               );
//             }

//             if (endpoint === '/package/:id/cost' && typeof response === 'object') {
//               const costData = response as PackageCost;
//               return (
//                 <div className="border rounded p-3 mb-2">
//                   <h5>Package Cost</h5>
//                   {Object.keys(costData).map((key) => (
//                     <div key={key}>
//                       <p>Package ID: {key}</p>
//                       {costData[key].standaloneCost !== undefined && (
//                         <p>Standalone Cost: {costData[key].standaloneCost} MB</p>
//                       )}
//                       <p>Total Cost: {costData[key].totalCost} MB</p>
//                     </div>
//                   ))}
//                 </div>
//               );
//             }

//             return <p>Unexpected response format</p>;
//           })()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default APIHandler;
