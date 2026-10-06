import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import formatDistance from '../utils/formatDistance.js';

const RouteHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('campusroute-history') || '[]');
    setHistory(storedHistory);
  }, []);

  return (
    <main className="page-shell history-page">
      <section className="history-card">
        <div className="history-header">
          <h2>Recent Route History</h2>
          <Link to="/" className="secondary-link">
            Back to home
          </Link>
        </div>

        {history.length === 0 ? (
          <p className="empty-state">No searches saved yet.</p>
        ) : (
          <div className="history-list">
            {history.map((item, index) => (
              <div key={`${item.timestamp}-${index}`} className="history-item">
                <div>
                  <strong>{item.source}</strong>
                  <span> → </span>
                  <strong>{item.destination}</strong>
                </div>
                <div className="history-meta">
                  <span>{item.algorithm}</span>
                  <span>{formatDistance(item.distance)}</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default RouteHistory;
