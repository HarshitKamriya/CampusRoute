import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (color) =>
  L.divIcon({
    className: 'custom-pin',
    html: `<span style="background:${color}; border:2px solid white; width: 16px; height: 16px; border-radius: 50%; display:block; box-shadow:0 0 0 3px rgba(0,0,0,0.12);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const CampusMap = ({ locations, route }) => {
  if (!locations.length) {
    return <div className="map-placeholder">Map loading...</div>;
  }

  const routeCoordinates = route?.path
    ? route.path
        .map((locationName) => {
          const match = locations.find((location) => location.name === locationName);
          if (!match) {
            return null;
          }
          return [match.latitude, match.longitude];
        })
        .filter(Boolean)
    : [];

  const sourceLocation = route?.path?.[0]
    ? locations.find((location) => location.name === route.path[0])
    : null;
  const destinationLocation = route?.path?.[route.path.length - 1]
    ? locations.find((location) => location.name === route.path[route.path.length - 1])
    : null;

  return (
    <div className="map-card">
      <MapContainer center={[34.1148, 74.825]} zoom={15} scrollWheelZoom className="map-container">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <CircleMarker
            key={location._id}
            center={[location.latitude, location.longitude]}
            radius={5}
            pathOptions={{ color: '#1f5eff', fillColor: '#1f5eff', fillOpacity: 0.8 }}
          >
            <Popup>{location.name}</Popup>
          </CircleMarker>
        ))}

        {sourceLocation && (
          <Marker position={[sourceLocation.latitude, sourceLocation.longitude]} icon={createIcon('#2ecc71')}>
            <Popup>Source: {sourceLocation.name}</Popup>
          </Marker>
        )}

        {destinationLocation && (
          <Marker position={[destinationLocation.latitude, destinationLocation.longitude]} icon={createIcon('#e74c3c')}>
            <Popup>Destination: {destinationLocation.name}</Popup>
          </Marker>
        )}

        {routeCoordinates.length > 1 && <Polyline positions={routeCoordinates} pathOptions={{ color: '#0d9488', weight: 5 }} />}
      </MapContainer>
    </div>
  );
};

export default CampusMap;
