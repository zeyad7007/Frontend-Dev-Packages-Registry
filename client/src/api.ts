// src/api.ts
import axios from 'axios';
import { QueryParams, APIResponse } from './Types';

const apiClient = axios.create({
  baseURL: 'http://3.94.57.71:3000',
  headers: { 'Content-Type': 'application/json' },
});

// GET request with query parameters
export const getData = async <T>(endpoint: string, params: QueryParams = {}): Promise<APIResponse<T>> => {
  const response = await apiClient.get(endpoint, { params });
  return response;
};

// POST request with body data
export async function postData<T>(url: string, payload: T) {
  const response = await apiClient.post(url, payload);
  return response.data;
};

// DELETE request
export const deleteData = async <T>(endpoint: string): Promise<APIResponse<T>> => {
  const response = await apiClient.delete(endpoint);
  return response.data;
};
