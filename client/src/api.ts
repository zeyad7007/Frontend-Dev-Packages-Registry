//api.ts
import axios from 'axios';
import { Package, PackageUpdateI, PackageUploadI, GetPackagesQuery, Metrics, CostI } from './Interface';

const apiClient = axios.create({
  baseURL: 'http://3.94.57.71:3000', // API server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPackages = async (offset: number, queries: GetPackagesQuery[]): Promise<Package[]> => {
  const response = await apiClient.post('/packages', queries, { params: { offset } });
  return response.data;
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

export const getPackageCost = async (id: string, dependency: boolean = false): Promise<CostI[]> => {
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
  const response = await apiClient.get('/tracks');
  console.log(response.data);
  return response.data.plannedTracks;
};
