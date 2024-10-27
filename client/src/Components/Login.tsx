// import React, { useState } from 'react';
// // import { authenticate } from '../api';

// interface LoginProps {
//   setToken: (token: string) => void;
// }

// const Login: React.FC<LoginProps> = ({ setToken }) => {
//   const [username, setUsername] = useState<string>('');
//   const [password, setPassword] = useState<string>('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { token } = await authenticate(username, password);
//       setToken(token);
//     } catch (error) {
//       console.error("Authentication failed", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="container mt-5 p-4 border rounded shadow-sm bg-light">
//       <h2 className="mb-4">Login</h2>
//       <div className="mb-3">
//         <label className="form-label">Username</label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Password</label>
//         <input
//           type="password"
//           className="form-control"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>
//       <button type="submit" className="btn btn-primary w-100">Login</button>
//     </form>
//   );
// };

// export default Login;
