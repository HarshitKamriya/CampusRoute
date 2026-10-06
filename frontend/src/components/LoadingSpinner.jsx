import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-box">
      <div className="spinner" />
      <span>Finding optimal route…</span>
    </div>
  );
};

export default LoadingSpinner;
