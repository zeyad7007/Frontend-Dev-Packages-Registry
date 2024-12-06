import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import UpdatePermissions from '../Components/UpdatePermissions'; 
import GetPermissions from '../Components/GetPermissions';
import RegisterUser from '../Components/RegisterUser';
import CreateGroup from '../Components/CreateGroup';
import AssignUserToGroup from '../Components/AssignUser';
import AssignPackageToGroup from '../Components/AssignPackage';
import GetGroups from '../Components/GetGroups';
import GetUsersInGroup from '../Components/GetUsersInGroup';
import GetPackageHistory from '../Components/GetHistory';




const AdminActions: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="container mt-5">
      <h1 className="display-4 fw-bold text-center">Admin Actions</h1>
      <p className="lead text-center">Manage user permissions and other admin-related tasks.</p>

      <div className="d-flex flex-wrap justify-content-around mt-5" role="navigation" aria-label="Admin Navigation">
        <Link to="update-permissions" className="btn btn-primary btn-lg m-2">Update Permissions</Link>
        <Link to="get-permissions" className="btn btn-primary btn-lg m-2">Get Permissions</Link>
        <Link to="register-user" className="btn btn-primary btn-lg m-2">Register User</Link>
        <Link to="create-group" className="btn btn-primary btn-lg m-2">Create Group</Link>
        <Link to="assign-user" id="assign-user" className="btn btn-primary btn-lg m-2">Assign User to Group</Link>
        <Link to="assign-package" className="btn btn-primary btn-lg m-2">Assign Package to Group</Link>
        <Link to="get-groups" className="btn btn-primary btn-lg m-2">Get Groups</Link>
        <Link to="get-users-in-group" className="btn btn-primary btn-lg m-2">Get Group Users</Link>
        <Link to="get-package-history" className="btn btn-primary btn-lg m-2">Get Package History</Link>
      </div>

      {/* Back Button */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/home')} // Navigate back to the home page
        >
          Back to Home
        </button>
      </div>

      {/* Nested Routes */}
      <Routes>
        <Route path="update-permissions" element={<UpdatePermissions />} />
        <Route path="get-permissions" element={<GetPermissions />} />
        <Route path="register-user" element={<RegisterUser />} />
        <Route path="create-group" element={<CreateGroup />} />
        <Route path="assign-user" element={<AssignUserToGroup />} />
        <Route path="assign-package" element={<AssignPackageToGroup />} />
        <Route path="get-groups" element={<GetGroups />} />
        <Route path="get-users-in-group" element={<GetUsersInGroup />} />
        <Route path="get-package-history" element={<GetPackageHistory />} />
      </Routes>
    </div>
  );
};

export default AdminActions;
