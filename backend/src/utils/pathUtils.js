export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
};

export const estimateWalkingTime = (distanceMeters, walkingSpeedKmh = 4.5) => {
  if (distanceMeters <= 0) {
    return 0;
  }

  const walkingSpeedMetersPerMinute = (walkingSpeedKmh * 1000) / 60;
  return Math.max(1, Math.round(distanceMeters / walkingSpeedMetersPerMinute));
};

export const formatDistance = (distanceMeters) => {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distanceMeters)} m`;
};

export const formatMinutes = (minutes) => `${minutes} min`;
