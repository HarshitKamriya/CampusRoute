import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import locationRoutes from './routes/locationRoutes.js';
import routeRoutes from './routes/routeRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        if (
          allowedOrigins.includes('*') ||
          allowedOrigins.includes(origin) ||
          hostname.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
      } catch {
        // Fallback if origin cannot be parsed as URL
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusRoute API is running.',
  });
});

app.use('/api/locations', locationRoutes);
app.use('/api/routes', routeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
