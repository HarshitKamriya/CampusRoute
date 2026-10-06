import mongoose from 'dotenv';
import { haversineDistance } from '../utils/pathUtils.js';

// 40 Locations on NIT Srinagar Hazratbal Campus
// Coordinates precisely aligned with OpenStreetMap (OSM) university boundary and buildings:
// Campus bounds: [34.1220, 74.8375] to [34.1275, 74.8445]
export const demoLocations = [
  // --- ENTRANCE & ADMINISTRATION ---
  { name: 'Main Gate', latitude: 34.12527, longitude: 74.83778, category: 'FACILITY' },
  { name: 'Administrative Block', latitude: 34.12505, longitude: 74.83865, category: 'ADMIN' },
  { name: 'Main Parking', latitude: 34.12542, longitude: 74.83748, category: 'FACILITY' },
  { name: 'Academic Parking', latitude: 34.12565, longitude: 74.83802, category: 'FACILITY' },

  // --- ACADEMIC DEPARTMENTS ---
  { name: 'Department of IT', latitude: 34.12661, longitude: 74.83899, category: 'ACADEMIC' },
  { name: 'Department of Chemical Engineering', latitude: 34.12591, longitude: 74.84051, category: 'ACADEMIC' },
  { name: 'Department of CSE', latitude: 34.12603, longitude: 74.84086, category: 'ACADEMIC' },
  { name: 'Department of ECE', latitude: 34.12589, longitude: 74.84083, category: 'ACADEMIC' },
  { name: 'Department of Civil Engineering', latitude: 34.12649, longitude: 74.83954, category: 'ACADEMIC' },
  { name: 'Department of Mechanical Engineering', latitude: 34.12622, longitude: 74.83956, category: 'ACADEMIC' },
  { name: 'Department of Metallurgical Engineering', latitude: 34.12563, longitude: 74.83945, category: 'ACADEMIC' },
  { name: 'Department of Chemistry', latitude: 34.12530, longitude: 74.83985, category: 'ACADEMIC' },
  { name: 'Department of Physics', latitude: 34.12510, longitude: 74.83995, category: 'ACADEMIC' },
  { name: 'Department of Electrical Engineering', latitude: 34.12469, longitude: 74.84006, category: 'ACADEMIC' },
  { name: 'Department of Mathematics', latitude: 34.12450, longitude: 74.83980, category: 'ACADEMIC' },
  { name: 'Department of HSSM', latitude: 34.12380, longitude: 74.84036, category: 'ACADEMIC' },

  // --- CLASSROOM BLOCKS ---
  { name: 'Classroom Block 1', latitude: 34.12620, longitude: 74.84106, category: 'ACADEMIC' },
  { name: 'Classroom Block 2', latitude: 34.12494, longitude: 74.84054, category: 'ACADEMIC' },
  { name: 'Classroom Block 3', latitude: 34.12444, longitude: 74.83975, category: 'ACADEMIC' },
  { name: 'Classroom Block 4', latitude: 34.12443, longitude: 74.84037, category: 'ACADEMIC' },

  // --- FOOD & AMENITIES ---
  { name: 'Central Canteen', latitude: 34.12500, longitude: 74.84120, category: 'FOOD' },
  { name: 'South Canteen', latitude: 34.12360, longitude: 74.83900, category: 'FOOD' },
  { name: 'Hostel Canteen', latitude: 34.12330, longitude: 74.84150, category: 'FOOD' },
  { name: 'Medical Unit', latitude: 34.12334, longitude: 74.84000, category: 'FACILITY' },
  { name: 'Convenience Store', latitude: 74.84180 ? 34.12280 : 34.12280, longitude: 74.84180, category: 'FACILITY' },

  // --- SPORTS & RECREATION ---
  { name: 'Tennis Courts', latitude: 34.12564, longitude: 74.84210, category: 'SPORTS' },
  { name: 'Cricket Ground', latitude: 34.12473, longitude: 74.84221, category: 'SPORTS' },
  { name: 'Athletic Track & Football Ground', latitude: 34.12508, longitude: 74.84361, category: 'SPORTS' },

  // --- HOSTELS & PARKING ---
  { name: 'Girls Hostel', latitude: 34.12675, longitude: 74.84150, category: 'HOSTEL' },
  { name: 'Mega Hostel', latitude: 34.12417, longitude: 74.84109, category: 'HOSTEL' },
  { name: 'Hostel Parking', latitude: 34.12380, longitude: 74.84080, category: 'FACILITY' },
  { name: 'Indus Hostel', latitude: 34.12312, longitude: 74.84042, category: 'HOSTEL' },
  { name: 'Chenab Hostel', latitude: 34.12252, longitude: 74.84125, category: 'HOSTEL' },
  { name: 'Tawi Hostel', latitude: 34.12285, longitude: 74.84327, category: 'HOSTEL' },
  { name: 'Post Graduate Hostel', latitude: 34.12240, longitude: 74.84220, category: 'HOSTEL' },
  { name: 'Jehlum Hostel', latitude: 34.12315, longitude: 74.84204, category: 'HOSTEL' },
  { name: 'Jehlum Extension Hostel', latitude: 34.12398, longitude: 74.84214, category: 'HOSTEL' },
  { name: 'Mansar Hostel', latitude: 34.12349, longitude: 74.84228, category: 'HOSTEL' },
  { name: 'Manasbal Hostel', latitude: 34.12420, longitude: 74.84280, category: 'HOSTEL' },
  { name: 'Dal Hostel', latitude: 34.12520, longitude: 74.84430, category: 'HOSTEL' }
];

// Connectivity graph edges
export const rawEdges = [
  // 1. Main entrance & front avenue
  ['Main Gate', 'Main Parking'],
  ['Main Gate', 'Administrative Block'],
  ['Main Gate', 'Academic Parking'],
  ['Main Gate', 'South Canteen'],
  ['Administrative Block', 'Academic Parking'],
  ['Administrative Block', 'Department of IT'],
  ['Administrative Block', 'Department of Civil Engineering'],
  ['Administrative Block', 'Department of Mechanical Engineering'],
  ['Administrative Block', 'Department of Metallurgical Engineering'],
  ['Administrative Block', 'Department of Mathematics'],
  ['Administrative Block', 'South Canteen'],

  // 2. Academic North (IT, Civil, Mech, Chemical, CSE, ECE)
  ['Department of IT', 'Department of Civil Engineering'],
  ['Department of IT', 'Academic Parking'],
  ['Department of IT', 'Department of Chemical Engineering'],
  ['Department of IT', 'Girls Hostel'],
  ['Department of Civil Engineering', 'Department of Mechanical Engineering'],
  ['Department of Mechanical Engineering', 'Department of Metallurgical Engineering'],
  ['Department of Chemical Engineering', 'Department of CSE'],
  ['Department of Chemical Engineering', 'Classroom Block 1'],
  ['Department of Chemical Engineering', 'Department of Metallurgical Engineering'],
  ['Department of Chemical Engineering', 'Girls Hostel'],
  ['Department of CSE', 'Department of ECE'],
  ['Department of CSE', 'Classroom Block 1'],
  ['Department of CSE', 'Tennis Courts'],
  ['Department of CSE', 'Central Canteen'],
  ['Department of CSE', 'Girls Hostel'],
  ['Department of ECE', 'Tennis Courts'],
  ['Department of ECE', 'Classroom Block 2'],
  ['Department of ECE', 'Classroom Block 1'],

  // 3. Central Sciences & Lecture Halls
  ['Department of Metallurgical Engineering', 'Department of Chemistry'],
  ['Department of Metallurgical Engineering', 'Classroom Block 2'],
  ['Department of Chemistry', 'Department of Physics'],
  ['Department of Chemistry', 'Classroom Block 2'],
  ['Department of Chemistry', 'Classroom Block 3'],
  ['Department of Physics', 'Department of Electrical Engineering'],
  ['Department of Physics', 'Classroom Block 2'],
  ['Department of Electrical Engineering', 'Department of Mathematics'],
  ['Department of Electrical Engineering', 'Classroom Block 3'],
  ['Department of Electrical Engineering', 'Classroom Block 4'],
  ['Department of Mathematics', 'Classroom Block 3'],
  ['Department of Mathematics', 'Classroom Block 4'],
  ['Department of Mathematics', 'South Canteen'],
  ['Classroom Block 2', 'Central Canteen'],
  ['Classroom Block 2', 'Classroom Block 4'],
  ['Classroom Block 3', 'Classroom Block 4'],
  ['Classroom Block 4', 'Central Canteen'],

  // 4. Southern Academic & Amenities
  ['South Canteen', 'Medical Unit'],
  ['Medical Unit', 'Department of HSSM'],
  ['Medical Unit', 'Indus Hostel'],
  ['Medical Unit', 'Hostel Parking'],
  ['Department of HSSM', 'Classroom Block 4'],
  ['Department of HSSM', 'Indus Hostel'],
  ['Department of HSSM', 'Hostel Parking'],
  ['Department of HSSM', 'Mega Hostel'],

  // 5. Central Hub & Sports Zone
  ['Central Canteen', 'Mega Hostel'],
  ['Central Canteen', 'Tennis Courts'],
  ['Central Canteen', 'Cricket Ground'],
  ['Tennis Courts', 'Cricket Ground'],
  ['Tennis Courts', 'Athletic Track & Football Ground'],
  ['Tennis Courts', 'Girls Hostel'],
  ['Cricket Ground', 'Athletic Track & Football Ground'],
  ['Cricket Ground', 'Mega Hostel'],
  ['Cricket Ground', 'Manasbal Hostel'],
  ['Athletic Track & Football Ground', 'Dal Hostel'],
  ['Athletic Track & Football Ground', 'Manasbal Hostel'],

  // 6. Hostel Quad & Residences
  ['Mega Hostel', 'Hostel Parking'],
  ['Mega Hostel', 'Indus Hostel'],
  ['Mega Hostel', 'Jehlum Extension Hostel'],
  ['Mega Hostel', 'Manasbal Hostel'],
  ['Hostel Parking', 'Indus Hostel'],
  ['Hostel Parking', 'Hostel Canteen'],
  ['Indus Hostel', 'Hostel Canteen'],
  ['Indus Hostel', 'Chenab Hostel'],
  ['Hostel Canteen', 'Convenience Store'],
  ['Hostel Canteen', 'Chenab Hostel'],
  ['Hostel Canteen', 'Jehlum Hostel'],
  ['Convenience Store', 'Chenab Hostel'],
  ['Convenience Store', 'Tawi Hostel'],
  ['Convenience Store', 'Post Graduate Hostel'],
  ['Chenab Hostel', 'Tawi Hostel'],
  ['Chenab Hostel', 'Jehlum Hostel'],
  ['Tawi Hostel', 'Post Graduate Hostel'],
  ['Tawi Hostel', 'Jehlum Hostel'],
  ['Post Graduate Hostel', 'Jehlum Hostel'],
  ['Jehlum Hostel', 'Mansar Hostel'],
  ['Jehlum Hostel', 'Jehlum Extension Hostel'],
  ['Jehlum Extension Hostel', 'Mansar Hostel'],
  ['Jehlum Extension Hostel', 'Manasbal Hostel'],
  ['Mansar Hostel', 'Manasbal Hostel'],
  ['Mansar Hostel', 'Dal Hostel'],
  ['Manasbal Hostel', 'Dal Hostel']
];

// Helper to build demoRoads with accurate, admissible distances and times
export const buildDemoRoads = (locs = demoLocations) => {
  const map = new Map(locs.map(l => [l.name, l]));
  return rawEdges.map(([from, to]) => {
    const l1 = map.get(from);
    const l2 = map.get(to);
    if (!l1 || !l2) throw new Error(`Missing location: ${from} or ${to}`);
    const straightDist = haversineDistance(l1.latitude, l1.longitude, l2.latitude, l2.longitude);
    // Winding path factor 1.15 to reflect real campus walking paths
    const distance = Math.max(25, Math.round(straightDist * 1.15)); 
    // Walking speed: ~75 meters/min (4.5 km/h)
    const estimatedTime = Math.max(1, Math.round(distance / 75));
    return { from, to, distance, estimatedTime };
  });
};
 