import { useEffect, useMemo, useState } from 'react';
import AlgorithmSelector from '../components/AlgorithmSelector.jsx';
import CampusMap from '../components/CampusMap.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import LocationSelector from '../components/LocationSelector.jsx';
import RouteResult from '../components/RouteResult.jsx';
import useRoute from '../hooks/useRoute.js';
import formatDistance from '../utils/formatDistance.js';

const Home = () => {
  const { locations, route, comparison, loading, error, fetchLocations, searchRoute } = useRoute();
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    algorithm: 'dijkstra',
    compareAlgorithms: false,
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const sourceLocation = useMemo(
    () => locations.find((location) => location._id === formData.source),
    [formData.source, locations]
  );

  const destinationLocation = useMemo(
    () => locations.find((location) => location._id === formData.destination),
    [formData.destination, locations]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.source || !formData.destination) {
      setFormError('Select source and destination');
      return;
    }

    if (formData.source === formData.destination) {
      setFormError('Source and destination must be different.');
      return;
    }

    setFormError('');

    const result = await searchRoute({
      source: formData.source,
      destination: formData.destination,
      algorithm: formData.algorithm,
      compareAlgorithms: formData.compareAlgorithms,
    });

    if (result.route) {
      const historyItem = {
        source: sourceLocation?.name || formData.source,
        destination: destinationLocation?.name || formData.destination,
        distance: result.route.distance,
        algorithm: result.route.algorithm,
        timestamp: new Date().toISOString(),
      };

      const currentHistory = JSON.parse(localStorage.getItem('campusroute-history') || '[]');
      localStorage.setItem(
        'campusroute-history',
        JSON.stringify([historyItem, ...currentHistory].slice(0, 8))
      );
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <h1>CampusRoute</h1>
        <p>Smart Campus Route Optimizer</p>

        <form className="route-form" onSubmit={handleSubmit}>
          <div className="selection-grid">
            <LocationSelector
              label="From"
              value={formData.source}
              onChange={(event) => setFormData({ ...formData, source: event.target.value })}
              options={locations}
            />

            <LocationSelector
              label="To"
              value={formData.destination}
              onChange={(event) => setFormData({ ...formData, destination: event.target.value })}
              options={locations}
            />
          </div>

          <div className="selection-grid compact-grid">
            <AlgorithmSelector
              value={formData.algorithm}
              onChange={(event) => setFormData({ ...formData, algorithm: event.target.value })}
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={formData.compareAlgorithms}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    compareAlgorithms: event.target.checked,
                  })
                }
              />
              Compare Algorithms
            </label>
          </div>

          {formError && <div className="inline-error">{formError}</div>}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Finding route...' : 'Find Route'}
          </button>
        </form>
      </section>

      <section className="content-grid">
        <div className="left-panel">
          {error && <ErrorMessage message={error} />}
          {loading && <LoadingSpinner />}
          {!loading && route && <RouteResult result={route} />}

          {comparison.length > 0 && (
            <div className="comparison-card">
              <h3>Algorithm Comparison</h3>
              <table>
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Distance</th>
                    <th>Nodes Explored</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item) => (
                    <tr key={item.algorithm}>
                      <td>{item.algorithm}</td>
                      <td>{formatDistance(item.distance)}</td>
                      <td>{item.nodesExplored}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {comparison[0]?.distance === comparison[1]?.distance && (
                <p className="comparison-note">
                  Both algorithms return the same shortest route, but A* typically explores fewer nodes because of the heuristic.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="right-panel">
          <CampusMap locations={locations} route={route} />
        </div>
      </section>
    </main>
  );
};

export default Home;
