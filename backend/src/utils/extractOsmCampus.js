import fs from 'fs';

async function extractCampusData() {
  const url = 'https://api.openstreetmap.org/api/0.6/map.json?bbox=74.8370,34.1215,74.8450,34.1275';
  console.log('Fetching OSM map data...');
  const res = await fetch(url, { headers: { 'User-Agent': 'CampusRoute/1.0' } });
  const data = await res.json();

  const nodeMap = new Map();
  data.elements.forEach(el => {
    if (el.type === 'node') {
      nodeMap.set(el.id, { lat: el.lat, lon: el.lon });
    }
  });

  const ways = data.elements.filter(el => el.type === 'way');
  const results = [];

  ways.forEach(w => {
    if (!w.tags) return;
    const name = w.tags.name;
    const building = w.tags.building;
    const leisure = w.tags.leisure;
    const amenity = w.tags.amenity;
    const sport = w.tags.sport;

    if (!name && !building && !leisure && !amenity && !sport) return;

    // Calculate center
    const coords = (w.nodes || []).map(id => nodeMap.get(id)).filter(Boolean);
    if (!coords.length) return;

    const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
    const avgLon = coords.reduce((sum, c) => sum + c.lon, 0) / coords.length;

    results.push({
      id: w.id,
      name: name || `${building || leisure || amenity || sport} (${w.id})`,
      tags: w.tags,
      center: [Number(avgLat.toFixed(6)), Number(avgLon.toFixed(6))],
      nodeCount: coords.length
    });
  });

  const namedOnly = results.filter(r => r.tags.name);
  console.log(`Found ${namedOnly.length} named ways:`);
  namedOnly.forEach(r => {
    console.log(`${r.name} -> [${r.center[0]}, ${r.center[1]}] (${JSON.stringify(r.tags)})`);
  });

  // Also look for highways/paths
  const highways = ways.filter(w => w.tags && w.tags.highway).map(w => {
    const coords = (w.nodes || []).map(id => nodeMap.get(id)).filter(Boolean);
    return {
      id: w.id,
      name: w.tags.name || 'unnamed path',
      highway: w.tags.highway,
      coords: coords.map(c => [c.lat, c.lon])
    };
  });
  console.log(`Found ${highways.length} highway ways.`);

  fs.writeFileSync('osm_campus_features.json', JSON.stringify({ namedOnly, highways, results }, null, 2));
}

extractCampusData().catch(console.error);
