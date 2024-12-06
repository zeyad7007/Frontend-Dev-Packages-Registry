import axios from 'axios';
import { 
  Package, 
  PackageUpdateI, 
  PackageUploadI, 
  GetPackagesQuery, 
  Metrics,  
  PackageListI, 
  AuthenticateI, 
  PermissionsI,
  UserPermissionsResponseI,
  UserRegisterI,
  GroupI,
  UsertoGroupI,
  PackettoGroupI,
  GroupResponseI,
  UserinGroupI,
  PackageHistoryI,
  PackageHistoryBodyI,
  CostFullData
} from './Interface';

// Create an Axios instance
export const apiClient  = axios.create({
  baseURL: 'https://fuwwahpackreg.xyz/', // API server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor to add the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Skip adding token for endpoints that don't require it
    const nonAuthEndpoints = ['/authenticate', '/tracks'];

    if (!nonAuthEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const token = localStorage.getItem('authToken'); // Get the token from localStorage
      console.log(token);
      if (token) {
        config.headers['X-Authorization'] = `${token}`; // Add Authorization header
        console.log(config.headers['X-Authorization']);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const getPackages = async (offset: number, queries: GetPackagesQuery[]): Promise<PackageListI[]> => {
  const response = await apiClient.post('/packages', queries, { params: { offset } });
  return response.data.packages;
};

export const resetRegistry = async (): Promise<void> => {
  await apiClient.delete('/reset');
};

export const getPackageById = async (id: string): Promise<Package> => {
  console.log(id);
  const response = await apiClient.get(`/package/${id}`);
  console.log(response.data);
  return response.data;
};

export const updatePackageById = async (id: string, data: PackageUpdateI): Promise<void> => {
  console.log(data);
  const response = await apiClient.post(`/package/${id}`, data);
  console.log(response);
};

export const uploadPackage = async (data: PackageUploadI): Promise<Package> => {
  console.log(data);
  const response = await apiClient.post('/package', data);
  console.log(response.data);
  return response.data;
};

export const getPackagesByRegex = async (regex: string): Promise<Package[]> => {
  console.log(regex);
  const response = await apiClient.post('/package/byRegEx', { RegEx: regex });
  console.log(response);
  return response.data;
};

export const getPackageCost = async (id: string, dependency: boolean = false): Promise<CostFullData> => {
  console.log(id);
  const response = await apiClient.get(`/package/${id}/cost`, { params: { dependency } });
  console.log(response.data);
  return response.data;
};

export const getPackageRating = async (id: string): Promise<Metrics> => {
  console.log(id);
  const response = await apiClient.get(`/package/${id}/rate`);
  console.log(response.data);
  return response.data;
};

export const getTracks = async (): Promise<string[]> => {
  const response = await apiClient.get('/tracks'); // Does not require Authorization
  console.log(response.data);
  return response.data.plannedTracks;
};

export const authenticate = async (data: AuthenticateI): Promise<string> => {
  const response = await apiClient.put('/authenticate', data); // Does not require Authorization
  console.log(response);
  return response.data;
};

export const logout = async (): Promise<string> => {
  const response = await apiClient.post('/logout');
  console.log(response);
  return response.data.message; 
};

export const updatePermissions = async (id:string, data:PermissionsI): Promise<UserPermissionsResponseI> => {
  const response = await apiClient.post(`/Access/${id}`, data);
  console.log(response);
  return response.data; 

};

export const getPermissions = async (id:string): Promise<PermissionsI> => {
  const response = await apiClient.get(`/Access/${id}`);
  console.log(response);
  return response.data; 
};

export const registerUser = async (data:UserRegisterI): Promise<string> => {
  const response = await apiClient.post('/register', data);
  console.log(response);
  return response.data.message;
};

export const createGroup = async (data:GroupI): Promise<number> => {
  const response = await apiClient.post('/group', data);
  console.log(response);
  return response.data.id;
};

export const assignUserToGroup = async (data:UsertoGroupI, groupId:number): Promise<string> => {
  const response = await apiClient.post(`/add_user/${groupId}`, data);
  console.log(response);
  return response.data.message;
};

export const assignPackageToGroup = async (data:PackettoGroupI, groupId:number): Promise<string> => {
  const response = await apiClient.post(`/add_package/${groupId}`, data);
  console.log(response);
  return response.data.message;
};

export const getGroups = async (): Promise<GroupResponseI[]> => {
  const response = await apiClient.get(`/groups`);
  console.log(response);
  return response.data;
};

export const getUsersInGroup = async (groupId:number): Promise<UserinGroupI[]> => {
  const response = await apiClient.get(`/groups/${groupId}`);
  console.log(response);
  return response.data;
};

export const getHistory = async (data:PackageHistoryBodyI): Promise<PackageHistoryI[]> => {
  const response = await apiClient.post(`/history`, data);
  console.log(response);
  return response.data;
};


