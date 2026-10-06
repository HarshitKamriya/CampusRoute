import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { ensureDataSeeded } from './data/seedData.js';

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = async (port = DEFAULT_PORT) => {
  try {
    await connectDB();
    await ensureDataSeeded();

    const server = app.listen(port, () => {

      console.log(`CampusRoute backend running on http://localhost:${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        const fallbackPort = port + 1;
        console.warn(`Port ${port} is busy. Retrying on port ${fallbackPort}.`);
        startServer(fallbackPort);
        return;
      }

      console.error('Failed to start the backend server:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start the backend server:', error.message);
    process.exit(1);
  }
};

startServer();
