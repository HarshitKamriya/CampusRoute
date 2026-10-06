import { useState } from 'react';
import { findRoute, getLocations } from '../services/api';

const useRoute = () => {
  const [locations, setLocations] = useState([]);
  const [route, setRoute] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
      return data;
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load campus locations.');
      return [];
    }
  };

  const searchRoute = async ({ source, destination, algorithm, compareAlgorithms = false }) => {
    setLoading(true);
    setError('');

    try {
      if (compareAlgorithms) {
        const [dijkstraResult, astarResult] = await Promise.all([
          findRoute({ source, destination, algorithm: 'dijkstra' }),
          findRoute({ source, destination, algorithm: 'astar' }),
        ]);

        setRoute(dijkstraResult);
        setComparison([
          { ...dijkstraResult, algorithmLabel: 'Dijkstra' },
          { ...astarResult, algorithmLabel: 'A*' },
        ]);
        return { route: dijkstraResult, comparison: [dijkstraResult, astarResult] };
      }

      const result = await findRoute({ source, destination, algorithm });
      setRoute(result);
      setComparison([]);
      return { route: result, comparison: [] };
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to find a route.';
      setError(message);
      setRoute(null);
      setComparison([]);
      return { route: null, comparison: [] };
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    route,
    comparison,
    loading,
    error,
    fetchLocations,
    searchRoute,
  };
};

export default useRoute;
