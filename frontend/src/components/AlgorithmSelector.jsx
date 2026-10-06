import React from 'react';

const AlgorithmSelector = ({ value, onChange }) => {
  return (
    <div className="field-group">
      <label>Algorithm</label>
      <div className="select-wrap">
        <select value={value} onChange={onChange}>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A* Search</option>
        </select>
        <span className="select-caret">▾</span>
      </div>
    </div>
  );
};

export default AlgorithmSelector;
