import { api } from '../lib/axiosInstance';
import { PropertyFormData } from '../lib/schemas/propertySchema';

// You might want to add interceptors for JWT tokens if required for the endpoint
// apiClient.interceptors.request.use(...)

export const createProperty = async (data: PropertyFormData) => {
  const response = await api.post('/properties', data); // Matches your Python backend route
  return response.data;
};