// // src/components/PackageRating.tsx
// import React, { useState } from 'react';
// import { getPackageRating } from '../api';

// const PackageRating: React.FC = () => {
//   const [id, setId] = useState<string>('');
//   const [rating, setRating] = useState<any>(null);

//   const fetchRating = async () => {
//     try {
//       const result = await getPackageRating(id);
//       setRating(result);
//     } catch (error) {
//       console.error("Failed to fetch package rating", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Get Package Rating</h2>
//       <input
//         type="text"
//         className="form-control my-3"
//         placeholder="Enter Package ID"
//         value={id}
//         onChange={(e) => setId(e.target.value)}
//       />
//       <button onClick={fetchRating} className="btn btn-info mb-3">Fetch Rating</button>
//       {rating && <pre className="bg-light p-3 rounded">{JSON.stringify(rating, null, 2)}</pre>}
//     </div>
//   );
// };

// export default PackageRating;
    