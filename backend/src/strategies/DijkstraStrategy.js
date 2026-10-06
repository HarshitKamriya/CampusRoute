import RouteStrategy from './RouteStrategy.js';
import dijkstra from '../algorithms/dijkstra.js';

class DijkstraStrategy extends RouteStrategy {
  findRoute(graph, source, destination) {
    return dijkstra(graph, source, destination);
  }
}

export default DijkstraStrategy;
