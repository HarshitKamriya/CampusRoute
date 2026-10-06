import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import locationRoutes from './routes/locationRoutes.js';
import routeRoutes from './routes/routeRoutes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
