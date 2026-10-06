import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
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
    () => locations.find((l) => l._id === formData.source),
    [formData.source, locations]
  );
  const destinationLocation = useMemo(
    () => locations.find((l) => l._id === formData.destination),
    [formData.destination, locations]
  );

  const handleSwap = () => {
    setFormData((prev) => ({ ...prev, source: prev.destination, destination: prev.source }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.source || !formData.destination) {
      setFormError('Please select both a starting location and destination.');
      return;
    }
    if (formData.source === formData.destination) {
      setFormError('Starting point and destination must be different.');
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
      const prev = JSON.parse(localStorage.getItem('campusroute-history') || '[]');
      localStorage.setItem('campusroute-history', JSON.stringify([historyItem, ...prev].slice(0, 10)));
    }
  };

  return (
    <main className="page-shell">
      {/* Hero */}
      <section className="hero">
        <h1>Campus Route Optimizer</h1>
        <p>Find the shortest walking path between any two locations on the NIT Srinagar campus using Dijkstra or A* pathfinding algorithms.</p>
      </section>

      {/* Main layout */}
      <section className="main-grid">
        {/* Left column: controls & results */}
        <div className="sidebar-col">
          <div className="card">
            <h3 className="card-title">Plan Your Route</h3>

            <form onSubmit={handleSubmit} className="route-form">
              <LocationSelector
                label="From"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                options={locations}
              />

              <div className="swap-row">
                <button type="button" className="btn-swap" onClick={handleSwap} title="Swap locations">
                  <ArrowLeftRight size={15} />
                </button>
              </div>

              <LocationSelector
                label="To"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                options={locations}
              />

              <div className="form-row">
                <AlgorithmSelector
                  value={formData.algorithm}
                  onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.compareAlgorithms}
                    onChange={(e) => setFormData({ ...formData, compareAlgorithms: e.target.checked })}
                  />
                  Compare algorithms
                </label>
              </div>

              {formError && <ErrorMessage message={formError} />}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Calculating…' : 'Find Route'}
              </button>
            </form>
          </div>

          {error && <ErrorMessage message={error} />}
          {loading && <LoadingSpinner />}

          {!loading && route && <RouteResult result={route} />}

          {/* Comparison table */}
          {comparison.length > 0 && (
            <div className="card">
              <h3 className="card-title">Algorithm Comparison</h3>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Distance</th>
                    <th>Nodes Explored</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item, idx) => {
                    const isAstar =
                      item.algorithmLabel === 'A*' ||
                      String(item.algorithm).toLowerCase() === 'astar' ||
                      item.algorithm === 'A*';
                    return (
                      <tr key={item.algorithmLabel || item.algorithm || idx}>
                        <td>{isAstar ? 'A*' : 'Dijkstra'}</td>
                        <td>{formatDistance(item.distance)}</td>
                        <td>{item.nodesExplored}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {comparison.length >= 2 &&
                comparison[0]?.distance === comparison[1]?.distance && (
                  <p className="comparison-note">
                    Both algorithms found the same shortest path. A* typically explores fewer nodes by using a distance heuristic.
                  </p>
                )}
            </div>
          )}
        </div>

        {/* Right column: map */}
        <div className="map-col">
          <CampusMap
            locations={locations}
            route={route}
            onSelectSource={(id) => setFormData((prev) => ({ ...prev, source: id }))}
            onSelectDestination={(id) => setFormData((prev) => ({ ...prev, destination: id }))}
          />
        </div>
      </section>
    </main>
  );
};

export default Home;
