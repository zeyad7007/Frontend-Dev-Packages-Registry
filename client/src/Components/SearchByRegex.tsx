// // src/components/SearchByRegex.tsx
// import React, { useState } from 'react';
// import { getPackagesByRegex, Package } from '../api';

// const SearchByRegex: React.FC = () => {
//   const [regex, setRegex] = useState<string>('');
//   const [packages, setPackages] = useState<Package[]>([]);

//   const handleSearch = async () => {
//     try {
//       const result = await getPackagesByRegex(regex);
//       setPackages(result);
//     } catch (error) {
//       console.error("Failed to search packages by regex", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Search Packages by Regex</h2>
//       <input
//         type="text"
//         className="form-control my-3"
//         placeholder="Enter Regex"
//         value={regex}
//         onChange={(e) => setRegex(e.target.value)}
//       />
//       <button onClick={handleSearch} className="btn btn-primary mb-3">Search</button>
//       <div className="mt-3">
//         {packages.length > 0 ? (
//           packages.map((pkg) => (
//             <div key={pkg.metadata.ID} className="border rounded p-3 mb-2">
//               <h5>{pkg.metadata.Name}</h5>
//               <p>Version: {pkg.metadata.Version}</p>
//             </div>
//           ))
//         ) : (
//           <p>No packages found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchByRegex;
