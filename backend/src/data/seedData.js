import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Edge from '../models/Edge.js';
import Location from '../models/Location.js';
import connectDB from '../config/db.js';

dotenv.config();

// Dummy data for NIT Srinagar campus (based on the Locorams campus map, 2023)
// Coordinates: approximate, anchored on ~34.125N 74.8397E (campus location per Wikipedia),
// positions scaled from the map layout (68-acre campus). Not surveyed - replace for production.
// Distances: straight-line metres x 1.25 (winding paths), rounded to 10 m. Time: ~72 m/min walking.

const demoLocations = [
  { name: 'Main Gate', latitude: 34.1225, longitude: 74.8362, category: 'FACILITY' },
  { name: 'Administrative Block', latitude: 34.1259, longitude: 74.8368, category: 'ADMIN' },
  { name: 'Department of Chemical Engineering', latitude: 34.1252, longitude: 74.8378, category: 'ACADEMIC' },
  { name: 'Department of Chemistry', latitude: 34.124, longitude: 74.838, category: 'ACADEMIC' },
  { name: 'Department of Civil Engineering', latitude: 34.1237, longitude: 74.8386, category: 'ACADEMIC' },
  { name: 'Department of CSE', latitude: 34.1259, longitude: 74.8385, category: 'ACADEMIC' },
  { name: 'Department of Electrical Engineering', latitude: 34.1242, longitude: 74.8387, category: 'ACADEMIC' },
  { name: 'Department of ECE', latitude: 34.1258, longitude: 74.8389, category: 'ACADEMIC' },
  { name: 'Department of HSSM', latitude: 34.1234, longitude: 74.8412, category: 'ACADEMIC' },
  { name: 'Department of IT', latitude: 34.1262, longitude: 74.8376, category: 'ACADEMIC' },
  { name: 'Department of Mathematics', latitude: 34.1238, longitude: 74.8387, category: 'ACADEMIC' },
  { name: 'Department of Mechanical Engineering', latitude: 34.1242, longitude: 74.8373, category: 'ACADEMIC' },
  { name: 'Department of Metallurgical Engineering', latitude: 34.125, longitude: 74.8384, category: 'ACADEMIC' },
  { name: 'Department of Physics', latitude: 34.1243, longitude: 74.838, category: 'ACADEMIC' },
  { name: 'Classroom Block 1', latitude: 34.1259, longitude: 74.838, category: 'ACADEMIC' },
  { name: 'Classroom Block 2', latitude: 34.1251, longitude: 74.8393, category: 'ACADEMIC' },
  { name: 'Classroom Block 3', latitude: 34.1244, longitude: 74.8386, category: 'ACADEMIC' },
  { name: 'Classroom Block 4', latitude: 34.1235, longitude: 74.8399, category: 'ACADEMIC' },
  { name: 'Chenab Hostel', latitude: 34.1236, longitude: 74.843, category: 'HOSTEL' },
  { name: 'Dal Hostel', latitude: 34.1245, longitude: 74.8439, category: 'HOSTEL' },
  { name: 'Girls Hostel', latitude: 34.1273, longitude: 74.8385, category: 'HOSTEL' },
  { name: 'Indus Hostel', latitude: 34.1236, longitude: 74.8415, category: 'HOSTEL' },
  { name: 'Jehlum Hostel', latitude: 34.1244, longitude: 74.8428, category: 'HOSTEL' },
  { name: 'Jehlum Extension Hostel', latitude: 34.1239, longitude: 74.8432, category: 'HOSTEL' },
  { name: 'Manasbal Hostel', latitude: 34.1249, longitude: 74.842, category: 'HOSTEL' },
  { name: 'Mansar Hostel', latitude: 34.1248, longitude: 74.8425, category: 'HOSTEL' },
  { name: 'Mega Hostel', latitude: 34.1245, longitude: 74.8406, category: 'HOSTEL' },
  { name: 'Post Graduate Hostel', latitude: 34.1226, longitude: 74.8428, category: 'HOSTEL' },
  { name: 'Tawi Hostel', latitude: 34.1231, longitude: 74.843, category: 'HOSTEL' },
  { name: 'Medical Unit', latitude: 34.1231, longitude: 74.8409, category: 'FACILITY' },
  { name: 'Central Canteen', latitude: 34.1246, longitude: 74.8396, category: 'FOOD' },
  { name: 'South Canteen', latitude: 34.1227, longitude: 74.8397, category: 'FOOD' },
  { name: 'Hostel Canteen', latitude: 34.1227, longitude: 74.8416, category: 'FOOD' },
  { name: 'Convenience Store', latitude: 34.1226, longitude: 74.8419, category: 'FACILITY' },
  { name: 'Athletic Track & Football Ground', latitude: 34.1258, longitude: 74.8416, category: 'SPORTS' },
  { name: 'Cricket Ground', latitude: 34.125, longitude: 74.8411, category: 'SPORTS' },
  { name: 'Tennis Courts', latitude: 34.1257, longitude: 74.8399, category: 'SPORTS' },
  { name: 'Main Parking', latitude: 34.1228, longitude: 74.836, category: 'FACILITY' },
  { name: 'Academic Parking', latitude: 34.1254, longitude: 74.838, category: 'FACILITY' },
  { name: 'Hostel Parking', latitude: 34.1231, longitude: 74.8402, category: 'FACILITY' },
];

const demoRoads = [
  { from: 'Main Gate', to: 'Main Parking', distance: 50, estimatedTime: 1 },
  { from: 'Administrative Block', to: 'Department of Chemical Engineering', distance: 150, estimatedTime: 2 },
  { from: 'Administrative Block', to: 'Department of IT', distance: 90, estimatedTime: 1 },
  { from: 'Department of Chemical Engineering', to: 'Department of Mechanical Engineering', distance: 140, estimatedTime: 2 },
  { from: 'Department of Chemical Engineering', to: 'Department of Metallurgical Engineering', distance: 70, estimatedTime: 1 },
  { from: 'Department of Chemical Engineering', to: 'Department of Physics', distance: 130, estimatedTime: 2 },
  { from: 'Department of Chemical Engineering', to: 'Academic Parking', distance: 50, estimatedTime: 1 },
  { from: 'Department of Chemistry', to: 'Department of Civil Engineering', distance: 80, estimatedTime: 1 },
  { from: 'Department of Chemistry', to: 'Department of Electrical Engineering', distance: 80, estimatedTime: 1 },
  { from: 'Department of Chemistry', to: 'Department of Mechanical Engineering', distance: 90, estimatedTime: 1 },
  { from: 'Department of Chemistry', to: 'Department of Physics', distance: 50, estimatedTime: 1 },
  { from: 'Department of Civil Engineering', to: 'Department of Mathematics', distance: 50, estimatedTime: 1 },
  { from: 'Department of Civil Engineering', to: 'South Canteen', distance: 180, estimatedTime: 2 },
  { from: 'Department of CSE', to: 'Department of ECE', distance: 50, estimatedTime: 1 },
  { from: 'Department of CSE', to: 'Classroom Block 1', distance: 50, estimatedTime: 1 },
  { from: 'Department of CSE', to: 'Girls Hostel', distance: 190, estimatedTime: 3 },
  { from: 'Department of Electrical Engineering', to: 'Department of Mathematics', distance: 50, estimatedTime: 1 },
  { from: 'Department of Electrical Engineering', to: 'Classroom Block 3', distance: 50, estimatedTime: 1 },
  { from: 'Department of Electrical Engineering', to: 'Central Canteen', distance: 120, estimatedTime: 2 },
  { from: 'Department of ECE', to: 'Department of Metallurgical Engineering', distance: 120, estimatedTime: 2 },
  { from: 'Department of ECE', to: 'Classroom Block 2', distance: 110, estimatedTime: 2 },
  { from: 'Department of ECE', to: 'Tennis Courts', distance: 120, estimatedTime: 2 },
  { from: 'Department of HSSM', to: 'Indus Hostel', distance: 50, estimatedTime: 1 },
  { from: 'Department of HSSM', to: 'Medical Unit', distance: 50, estimatedTime: 1 },
  { from: 'Department of HSSM', to: 'Hostel Canteen', distance: 110, estimatedTime: 2 },
  { from: 'Department of IT', to: 'Classroom Block 1', distance: 60, estimatedTime: 1 },
  { from: 'Department of IT', to: 'Girls Hostel', distance: 190, estimatedTime: 3 },
  { from: 'Department of Mathematics', to: 'Classroom Block 4', distance: 130, estimatedTime: 2 },
  { from: 'Department of Mechanical Engineering', to: 'Department of Physics', distance: 80, estimatedTime: 1 },
  { from: 'Department of Mechanical Engineering', to: 'Main Parking', distance: 250, estimatedTime: 3 },
  { from: 'Department of Metallurgical Engineering', to: 'Classroom Block 2', distance: 110, estimatedTime: 2 },
  { from: 'Department of Metallurgical Engineering', to: 'Classroom Block 3', distance: 90, estimatedTime: 1 },
  { from: 'Department of Metallurgical Engineering', to: 'Academic Parking', distance: 70, estimatedTime: 1 },
  { from: 'Department of Physics', to: 'Classroom Block 3', distance: 60, estimatedTime: 1 },
  { from: 'Classroom Block 1', to: 'Girls Hostel', distance: 200, estimatedTime: 3 },
  { from: 'Classroom Block 1', to: 'Academic Parking', distance: 70, estimatedTime: 1 },
  { from: 'Classroom Block 2', to: 'Classroom Block 3', distance: 130, estimatedTime: 2 },
  { from: 'Classroom Block 2', to: 'Central Canteen', distance: 80, estimatedTime: 1 },
  { from: 'Classroom Block 2', to: 'Tennis Courts', distance: 100, estimatedTime: 1 },
  { from: 'Classroom Block 3', to: 'Central Canteen', distance: 120, estimatedTime: 2 },
  { from: 'Classroom Block 4', to: 'Mega Hostel', distance: 160, estimatedTime: 2 },
  { from: 'Classroom Block 4', to: 'Central Canteen', distance: 150, estimatedTime: 2 },
  { from: 'Classroom Block 4', to: 'Hostel Parking', distance: 70, estimatedTime: 1 },
  { from: 'Chenab Hostel', to: 'Indus Hostel', distance: 170, estimatedTime: 2 },
  { from: 'Chenab Hostel', to: 'Jehlum Extension Hostel', distance: 50, estimatedTime: 1 },
  { from: 'Chenab Hostel', to: 'Tawi Hostel', distance: 70, estimatedTime: 1 },
  { from: 'Dal Hostel', to: 'Jehlum Hostel', distance: 120, estimatedTime: 2 },
  { from: 'Dal Hostel', to: 'Jehlum Extension Hostel', distance: 110, estimatedTime: 2 },
  { from: 'Indus Hostel', to: 'Jehlum Hostel', distance: 190, estimatedTime: 3 },
  { from: 'Indus Hostel', to: 'Manasbal Hostel', distance: 190, estimatedTime: 3 },
  { from: 'Indus Hostel', to: 'Mega Hostel', distance: 160, estimatedTime: 2 },
  { from: 'Jehlum Hostel', to: 'Jehlum Extension Hostel', distance: 80, estimatedTime: 1 },
  { from: 'Jehlum Hostel', to: 'Mansar Hostel', distance: 70, estimatedTime: 1 },
  { from: 'Manasbal Hostel', to: 'Mansar Hostel', distance: 60, estimatedTime: 1 },
  { from: 'Manasbal Hostel', to: 'Athletic Track & Football Ground', distance: 140, estimatedTime: 2 },
  { from: 'Manasbal Hostel', to: 'Cricket Ground', distance: 100, estimatedTime: 1 },
  { from: 'Mega Hostel', to: 'Central Canteen', distance: 120, estimatedTime: 2 },
  { from: 'Mega Hostel', to: 'Cricket Ground', distance: 90, estimatedTime: 1 },
  { from: 'Mega Hostel', to: 'Tennis Courts', distance: 180, estimatedTime: 2 },
  { from: 'Post Graduate Hostel', to: 'Tawi Hostel', distance: 70, estimatedTime: 1 },
  { from: 'Post Graduate Hostel', to: 'Convenience Store', distance: 100, estimatedTime: 1 },
  { from: 'Medical Unit', to: 'Hostel Canteen', distance: 100, estimatedTime: 1 },
  { from: 'Medical Unit', to: 'Hostel Parking', distance: 80, estimatedTime: 1 },
  { from: 'South Canteen', to: 'Hostel Parking', distance: 90, estimatedTime: 1 },
  { from: 'Hostel Canteen', to: 'Convenience Store', distance: 50, estimatedTime: 1 },
  { from: 'Athletic Track & Football Ground', to: 'Cricket Ground', distance: 130, estimatedTime: 2 },
  { from: 'Athletic Track & Football Ground', to: 'Tennis Courts', distance: 200, estimatedTime: 3 },
  { from: 'Cricket Ground', to: 'Tennis Courts', distance: 170, estimatedTime: 2 },
];

export const ensureDataSeeded = async () => {
  const count = await Location.countDocuments();
  if (count > 0) {
    return;
  }

  const createdLocations = await Location.insertMany(demoLocations);
  const locationMap = Object.fromEntries(createdLocations.map((location) => [location.name, location]));

  const roadsToInsert = [];

  for (const road of demoRoads) {
    const fromLocation = locationMap[road.from];
    const toLocation = locationMap[road.to];

    if (!fromLocation || !toLocation) {
      continue;
    }

    roadsToInsert.push({
      from: fromLocation._id,
      to: toLocation._id,
      distance: road.distance,
      estimatedTime: road.estimatedTime,
    });
    roadsToInsert.push({
      from: toLocation._id,
      to: fromLocation._id,
      distance: road.distance,
      estimatedTime: road.estimatedTime,
    });
  }

  await Edge.insertMany(roadsToInsert);
  console.log(`Auto-seeded ${createdLocations.length} campus locations and ${roadsToInsert.length} edges.`);
};

const seedDatabase = async () => {
  await connectDB();
  await Promise.all([Location.deleteMany({}), Edge.deleteMany({})]);
  await ensureDataSeeded();
  console.log('Seeding completed.');
  await mongoose.disconnect();
};

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error.message);
      process.exit(1);
    });
}

export { demoLocations, demoRoads, seedDatabase };

