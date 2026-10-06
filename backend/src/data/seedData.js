import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Edge from '../models/Edge.js';
import Location from '../models/Location.js';
import connectDB from '../config/db.js';
import { demoLocations, buildDemoRoads } from './campusGeoData.js';

dotenv.config();

const demoRoads = buildDemoRoads(demoLocations);

export const ensureDataSeeded = async (force = false) => {
  const count = await Location.countDocuments();

  // If force is false, check if an existing location has outdated coordinates
  let needsReseed = force || count === 0;
  if (!needsReseed && count > 0) {
    const mainGate = await Location.findOne({ name: 'Main Gate' });
    // If Main Gate has old inaccurate coordinates (34.1225 or 74.8362), reseed
    if (mainGate && (mainGate.latitude < 34.124 || mainGate.longitude < 74.837)) {
      console.log('Outdated coordinates detected in database. Reseeding with verified OSM coordinates...');
      needsReseed = true;
    }
  }

  if (!needsReseed) {
    return;
  }

  await Promise.all([Location.deleteMany({}), Edge.deleteMany({})]);

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
  }

  await Edge.insertMany(roadsToInsert);
  console.log(`Auto-seeded ${createdLocations.length} campus locations and ${roadsToInsert.length} bidirectional edges.`);
};

const seedDatabase = async () => {
  await connectDB();
  await ensureDataSeeded(true);
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
