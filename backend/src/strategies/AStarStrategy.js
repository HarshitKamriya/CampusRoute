import RouteStrategy from './RouteStrategy.js';
import astar from '../algorithms/astar.js';

class AStarStrategy extends RouteStrategy {
  findRoute(graph, source, destination, coordinates = {}) {
    return astar(graph, source, destination, coordinates);
  }
}

export default AStarStrategy;
