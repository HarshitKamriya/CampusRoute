import React, { useEffect, useMemo } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

/* Automatically fit bounds to NIT Srinagar campus or active route */
const MapBoundsUpdater = ({ coordinates, allLocations }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (coordinates && coordinates.length > 1) {
      map.fitBounds(L.latLngBounds(coordinates), { padding: [50, 50], maxZoom: 18 });
    } else if (allLocations && allLocations.length > 0) {
      const allCoords = allLocations.map((l) => [l.latitude, l.longitude]);
      map.fitBounds(L.latLngBounds(allCoords), { padding: [35, 35], maxZoom: 17 });
    }
  }, [coordinates, allLocations, map]);

  return null;
};

/* Custom pin icons */
const createPin = (color, text = '') =>
  L.divIcon({
    className: 'leaflet-pin',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:2.5px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:12px;font-weight:700;font-family:Inter,sans-serif;">${text}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

const CATEGORY_COLORS = {
  ACADEMIC: '#1d4ed8', // Royal academic blue
  HOSTEL: '#b45309',   // Warm amber
  FOOD: '#047857',     // Emerald green
  SPORTS: '#7c3aed',   // Purple
  ADMIN: '#8B1E2D',    // NIT Crimson
  FACILITY: '#0284c7', // Slate sky blue
  OTHER: '#64748b',
};

const CampusMap = ({
  locations = [],
  route = null,
  onSelectSource = null,
  onSelectDestination = null,
}) => {
  // Center of NIT Srinagar Hazratbal campus
  const center = [34.1250, 74.8410];

  const routeCoords = useMemo(() => {
    if (!route?.path || !locations.length) return [];
    return route.path
      .map((name) => {
        const loc = locations.find((l) => l.name === name);
        return loc ? [loc.latitude, loc.longitude] : null;
      })
      .filter(Boolean);
  }, [route, locations]);

  const src = useMemo(
    () => (route?.path?.[0] ? locations.find((l) => l.name === route.path[0]) : null),
    [route, locations]
  );

  const dest = useMemo(
    () =>
      route?.path?.length > 1
        ? locations.find((l) => l.name === route.path[route.path.length - 1])
        : null,
    [route, locations]
  );

  if (!locations.length) {
    return <div className="map-placeholder">Loading NIT Srinagar campus locations…</div>;
  }

  return (
    <div className="map-card">
      <MapContainer center={center} zoom={16} scrollWheelZoom className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater coordinates={routeCoords} allLocations={locations} />

        {/* Campus location nodes */}
        {locations.map((loc) => {
          if (src?.name === loc.name || dest?.name === loc.name) return null;
          const isOnRoute = route?.path?.includes(loc.name);
          const color = CATEGORY_COLORS[loc.category] || '#0284c7';

          return (
            <CircleMarker
              key={loc._id}
              center={[loc.latitude, loc.longitude]}
              radius={isOnRoute ? 7 : 5.5}
              pathOptions={{
                color: isOnRoute ? '#8B1E2D' : color,
                fillColor: isOnRoute ? '#8B1E2D' : color,
                fillOpacity: isOnRoute ? 0.95 : 0.75,
                weight: isOnRoute ? 3 : 1.5,
              }}
            >
              <Popup>
                <div className="map-popup-content">
                  <span className="popup-category-badge" style={{ backgroundColor: `${color}18`, color }}>
                    {loc.category}
                  </span>
                  <strong className="popup-title">{loc.name}</strong>
                  {(onSelectSource || onSelectDestination) && (
                    <div className="popup-actions">
                      {onSelectSource && (
                        <button
                          type="button"
                          className="popup-btn popup-btn-start"
                          onClick={() => onSelectSource(loc._id)}
                        >
                          Set as Start
                        </button>
                      )}
                      {onSelectDestination && (
                        <button
                          type="button"
                          className="popup-btn popup-btn-dest"
                          onClick={() => onSelectDestination(loc._id)}
                        >
                          Set as Destination
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Source marker */}
        {src && (
          <Marker position={[src.latitude, src.longitude]} icon={createPin('#047857', 'A')}>
            <Popup>
              <div className="map-popup-content">
                <span className="popup-category-badge" style={{ backgroundColor: '#04785718', color: '#047857' }}>
                  START POINT
                </span>
                <strong className="popup-title">{src.name}</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {dest && (
          <Marker position={[dest.latitude, dest.longitude]} icon={createPin('#8B1E2D', 'B')}>
            <Popup>
              <div className="map-popup-content">
                <span className="popup-category-badge" style={{ backgroundColor: '#8B1E2D18', color: '#8B1E2D' }}>
                  DESTINATION
                </span>
                <strong className="popup-title">{dest.name}</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route polyline with NIT crimson styling */}
        {routeCoords.length > 1 && (
          <>
            {/* Outer halo */}
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: 'rgba(139, 30, 45, 0.25)', weight: 10, lineCap: 'round', lineJoin: 'round' }}
            />
            {/* Solid route path */}
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#8B1E2D', weight: 4.5, lineCap: 'round', lineJoin: 'round' }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default CampusMap;
