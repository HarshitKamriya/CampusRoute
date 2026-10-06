import mongoose from 'mongoose';
import Location from '../models/Location.js';
import AppError from '../utils/AppError.js';
import DijkstraStrategy from '../strategies/DijkstraStrategy.js';
import AStarStrategy from '../strategies/AStarStrategy.js';
import graphService from './graphService.js';

class RouteService {
  constructor() {
    this.strategies = {
      dijkstra: new DijkstraStrategy(),
      astar: new AStarStrategy(),
    };
  }

  getStrategy(algorithm) {
    const normalizedAlgorithm = String(algorithm || 'dijkstra').toLowerCase();

    if (!this.strategies[normalizedAlgorithm]) {
      throw new AppError(400, 'Invalid algorithm. Use dijkstra or astar.');
    }

    return this.strategies[normalizedAlgorithm];
  }

  async findRoute({ source, destination, algorithm = 'dijkstra' }) {
    if (!source || !destination) {
      throw new AppError(400, 'Source and destination are required.');
    }

    if (!mongoose.Types.ObjectId.isValid(source) || !mongoose.Types.ObjectId.isValid(destination)) {
      throw new AppError(400, 'Location identifiers are invalid.');
    }

    const sourceLocation = await Location.findById(source);
    const destinationLocation = await Location.findById(destination);

    if (!sourceLocation || !destinationLocation) {
      throw new AppError(404, 'One or both locations were not found.');
    }

    if (source === destination) {
      throw new AppError(400, 'Source and destination must be different.');
    }

    const { graph } = await graphService.getGraph();
    const strategy = this.getStrategy(algorithm);
    const coordinates = {};

    await Location.find({}).then((locations) => {
      locations.forEach((location) => {
        coordinates[location.name] = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      });
    });

    const result = strategy.findRoute(graph, sourceLocation.name, destinationLocation.name, coordinates);

    if (!result || result.unreachable || !result.path || result.path.length === 0) {
      throw new AppError(404, 'No route is available between the selected locations.');
    }

    return {
      success: true,
      algorithm: result.algorithm,
      path: result.path,
      distance: result.distance,
      estimatedTime: result.estimatedTime,
      nodesExplored: result.nodesExplored,
    };
  }
}

export default new RouteService();
