// src/api.ts
import axios from 'axios';

export interface Package {
  metadata: {
    Name: string;
    Version: string;
    ID: string;
  };
  data: {
    Content?: string;
    URL?: string;
    JSProgram: string;
  };
}

// Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/package', // API server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPackages = async (offset: number): Promise<Package[]> => {
  const response = await apiClient.post('/packages', [{ Name: '*' }], { params: { offset } });
  return response.data;
};

export const resetRegistry = async (): Promise<void> => {
  await apiClient.delete('/reset');
};

export const getPackageById = async (id: string): Promise<Package> => {
  const response = await apiClient.get(`/package/${id}`);
  return response.data;
};

export const updatePackageById = async (id: string, data: Package): Promise<void> => {
  await apiClient.post(`/package/${id}`, data);
};

export const uploadPackage = async (data: Package): Promise<Package> => {
  const response = await apiClient.post('/package', data);
  return response.data;
};

export const getPackagesByRegex = async (regex: string): Promise<Package[]> => {
  const response = await apiClient.post('/package/byRegEx', { RegEx: regex });
  return response.data;
};

export const getPackageCost = async (id: string, dependency: boolean = false): Promise<any> => {
  const response = await apiClient.get(`/package/${id}/cost`, { params: { dependency } });
  return response.data;
};

export const getPackageRating = async (id: string): Promise<any> => {
  const response = await apiClient.get(`/package/${id}/rate`);
  return response.data;
};

export const getTracks = async (): Promise<string[]> => {
  const response = await apiClient.get('/tracks');
  return response.data.plannedTracks;
};
