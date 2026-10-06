const LocationSelector = ({ label, value, onChange, options }) => {
  return (
    <div className="field-group">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        <option value="">Select a location</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
