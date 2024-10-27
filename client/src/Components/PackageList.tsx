// // src/components/PackageList.tsx
// import React, { useEffect, useState } from 'react';
// import { getPackages, Package } from '../api';

// const PackageList: React.FC = () => {
//   const [packages, setPackages] = useState<Package[]>([]);
//   const [offset, setOffset] = useState<number>(0);

//   const fetchPackages = async () => {
//     try {
//       const result = await getPackages(offset);
//       setPackages(result);
//     } catch (error) {
//       console.error("Failed to load packages", error);
//     }
//   };

//   useEffect(() => {
//     fetchPackages();
//   }, [offset]);

//   return (
//     <div className="container">
//       <h2>Package List</h2>
//       <button onClick={fetchPackages} className="btn btn-primary mb-3">Load Packages</button>
//       {packages.map((pkg) => (
//         <div key={pkg.metadata.ID} className="border rounded p-3 mb-2">
//           <h5>{pkg.metadata.Name}</h5>
//           <p>Version: {pkg.metadata.Version}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PackageList;
