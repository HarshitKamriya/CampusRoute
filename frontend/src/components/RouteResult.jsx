import formatDistance from '../utils/formatDistance.js';
import formatTime from '../utils/formatTime.js';

const RouteResult = ({ result }) => {
  if (!result) {
    return <div className="empty-state">Select source and destination</div>;
  }

  return (
    <div className="result-card">
      <h3>Shortest Route</h3>
      <div className="route-steps">
        {result.path.map((step, index) => (
          <div className="route-step" key={`${step}-${index}`}>
            <span className="route-index">{index + 1}</span>
            <span>{step}</span>
            {index < result.path.length - 1 && <span className="route-arrow">↓</span>}
          </div>
        ))}
      </div>

      <div className="stats-grid">
        <div>
          <label>Distance</label>
          <strong>{formatDistance(result.distance)}</strong>
        </div>
        <div>
          <label>Estimated Time</label>
          <strong>{formatTime(result.estimatedTime)}</strong>
        </div>
        <div>
          <label>Algorithm</label>
          <strong>{result.algorithm}</strong>
        </div>
        <div>
          <label>Nodes Explored</label>
          <strong>{result.nodesExplored}</strong>
        </div>
      </div>
    </div>
  );
};

export default RouteResult;
