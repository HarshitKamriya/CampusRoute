import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import formatDistance from '../utils/formatDistance.js';

const RouteHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('campusroute-history') || '[]'));
  }, []);

  const handleClear = () => {
    localStorage.removeItem('campusroute-history');
    setHistory([]);
  };

  return (
    <main className="page-shell history-page">
      <div className="card">
        <div className="history-header">
          <div>
            <h2>Route History</h2>
            <p className="text-secondary">Your recent campus navigation searches.</p>
          </div>
          <div className="history-actions">
            <Link to="/" className="btn-link">← Back</Link>
            {history.length > 0 && (
              <button type="button" className="btn-danger-sm" onClick={handleClear}>Clear</button>
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <p>No searches saved yet.</p>
            <Link to="/" className="btn-primary-sm">Find a Route</Link>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, i) => (
              <div key={`${item.timestamp}-${i}`} className="history-item">
                <div className="history-route">
                  <strong>{item.source}</strong>
                  <span className="history-arrow">→</span>
                  <strong>{item.destination}</strong>
                </div>
                <div className="history-meta">
                  <span>{formatDistance(item.distance)}</span>
                  <span>{String(item.algorithm).toLowerCase() === 'astar' || item.algorithm === 'A*' ? 'A*' : 'Dijkstra'}</span>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default RouteHistory;
