async function main() {
  const query = `[out:json][timeout:25];
(
  node(34.1210,74.8360,34.1285,74.8460);
  way(34.1210,74.8360,34.1285,74.8460);
);
out tags center;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'CampusRoute/1.0' } });
  if (!res.ok) {
    const text = await res.text();
    console.error('Status:', res.status, text.slice(0, 300));
    return;
  }
  const data = await res.json();
  console.log('Total elements:', data.elements.length);
  const withNames = data.elements.filter(e => e.tags && e.tags.name);
  for (const e of withNames) {
    const lat = e.lat || e.center?.lat;
    const lon = e.lon || e.center?.lon;
    console.log(`${e.tags.name} | [${lat}, ${lon}] | ${e.tags.building || e.tags.amenity || e.tags.highway || ''}`);
  }
}
main().catch(console.error);
