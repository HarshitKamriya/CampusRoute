import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import formatDistance from '../utils/formatDistance.js';
import formatTime from '../utils/formatTime.js';

const RouteResult = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result || !result.path?.length) return null;

  const start = result.path[0];
  const end = result.path[result.path.length - 1];

  const handleCopy = () => {
    const text = `${start} → ${end} | ${formatDistance(result.distance)}, ~${formatTime(result.estimatedTime)} walking (${result.algorithm})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-card">
      {/* Header */}
      <div className="result-header">
        <h3>
          {start}
          <ArrowRight size={16} className="result-arrow" />
          {end}
        </h3>
        <button type="button" className="btn-copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat">
          <span className="stat-label">Distance</span>
          <span className="stat-value">{formatDistance(result.distance)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Walking Time</span>
          <span className="stat-value">{formatTime(result.estimatedTime)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Algorithm</span>
          <span className="stat-value">
            {String(result.algorithm).toLowerCase() === 'astar' || result.algorithm === 'A*' ? 'A*' : 'Dijkstra'}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Nodes Explored</span>
          <span className="stat-value">{result.nodesExplored}</span>
        </div>
      </div>

      {/* Steps */}
      <div className="steps-section">
        <h4>Route ({result.path.length} stops)</h4>
        <ol className="steps-list">
          {result.path.map((step, i) => (
            <li key={`${step}-${i}`} className={i === 0 ? 'step-start' : i === result.path.length - 1 ? 'step-end' : ''}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RouteResult;
