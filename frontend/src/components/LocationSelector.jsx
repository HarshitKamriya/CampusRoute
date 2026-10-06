import React from 'react';

const LocationSelector = ({ label, value, onChange, options = [] }) => {
  const grouped = {};
  options.forEach((opt) => {
    const cat = opt.category || 'FACILITY';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(opt);
  });
  Object.values(grouped).forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name)));

  const order = [
    ['ACADEMIC', 'Academic & Classrooms'],
    ['HOSTEL', 'Hostels'],
    ['FOOD', 'Canteens'],
    ['SPORTS', 'Sports'],
    ['ADMIN', 'Administration'],
    ['FACILITY', 'Facilities'],
  ];

  return (
    <div className="field-group">
      <label>{label}</label>
      <div className="select-wrap">
        <select value={value} onChange={onChange}>
          <option value="">Select location</option>
          {order.map(([key, heading]) => {
            const list = grouped[key];
            if (!list || !list.length) return null;
            return (
              <optgroup key={key} label={heading}>
                {list.map((o) => (
                  <option key={o._id} value={o._id}>{o.name}</option>
                ))}
              </optgroup>
            );
          })}
        </select>
        <span className="select-caret">▾</span>
      </div>
    </div>
  );
};

export default LocationSelector;
