const AlgorithmSelector = ({ value, onChange }) => {
  return (
    <div className="field-group">
      <label>Algorithm</label>
      <select value={value} onChange={onChange}>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
      </select>
    </div>
  );
};

export default AlgorithmSelector;
