// // src/components/UpdatePackage.tsx
// import React, { useState } from 'react';
// import { updatePackageById, Package } from '../api';

// const UpdatePackage: React.FC = () => {
//   const [id, setId] = useState<string>('');
//   const [packageData, setPackageData] = useState<Package | null>(null);

//   const handleUpdate = async () => {
//     if (!packageData) return;
//     try {
//       await updatePackageById(id, packageData);
//       alert("Package updated successfully.");
//     } catch (error) {
//       console.error("Failed to update package", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Update Package by ID</h2>
//       <input
//         type="text"
//         className="form-control my-3"
//         placeholder="Enter Package ID"
//         value={id}
//         onChange={(e) => setId(e.target.value)}
//       />
//       <textarea
//         className="form-control my-3"
//         placeholder="Enter package content in JSON"
//         value={JSON.stringify(packageData || {}, null, 2)}
//         onChange={(e) => setPackageData(JSON.parse(e.target.value))}
//       />
//       <button onClick={handleUpdate} className="btn btn-warning">Update Package</button>
//     </div>
//   );
// };

// export default UpdatePackage;
