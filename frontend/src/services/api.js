import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

export const findRoute = async ({ source, destination, algorithm }) => {
  const response = await api.post('/routes/find', {
    source,
    destination,
    algorithm,
  });
  return response.data;
};
