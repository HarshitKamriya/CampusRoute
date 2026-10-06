import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    const mongoMemoryServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoMemoryServer.getUri();
    console.log('MONGO_URI was not set, using an in-memory MongoDB instance for development.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected successfully.');
};

export default connectDB;
