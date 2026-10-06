import AppError from '../utils/AppError.js';
import routeService from '../services/routeService.js';

const VALID_ALGORITHMS = new Set(['dijkstra', 'astar']);

export const findRoute = async (req, res, next) => {
  try {
    const { source, destination, algorithm = 'dijkstra' } = req.body || {};

    if (!source) {
      throw new AppError(400, 'Source location is required.');
    }

    if (!destination) {
      throw new AppError(400, 'Destination location is required.');
    }

    if (source === destination) {
      throw new AppError(400, 'Source and destination must be different.');
    }

    const normalizedAlgorithm = String(algorithm).toLowerCase();

    if (!VALID_ALGORITHMS.has(normalizedAlgorithm)) {
      throw new AppError(400, 'Invalid algorithm selected. Please use dijkstra or astar.');
    }

    const result = await routeService.findRoute({
      source,
      destination,
      algorithm: normalizedAlgorithm,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
