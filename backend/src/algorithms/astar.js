import MinHeap from './MinHeap.js';
import { haversineDistance } from '../utils/pathUtils.js';

const astar = (graph, source, destination, coordinates = {}) => {
  if (!graph || !graph.hasNode(source) || !graph.hasNode(destination)) {
    return null;
  }

  if (source === destination) {
    return {
      path: [source],
      distance: 0,
      estimatedTime: 0,
      nodesExplored: 1,
      algorithm: 'A*',
    };
  }

  const openSet = new MinHeap();
  const gScore = new Map();
  const previous = new Map();
  const visited = new Set();

  const heuristic = (node) => {
    const startLocation = coordinates[node];
    const endLocation = coordinates[destination];

    if (!startLocation || !endLocation) {
      return 0;
    }

    return haversineDistance(
      startLocation.latitude,
      startLocation.longitude,
      endLocation.latitude,
      endLocation.longitude
    );
  };

  gScore.set(source, 0);
  openSet.push({ node: source, distance: heuristic(source) });

  while (!openSet.isEmpty()) {
    const currentItem = openSet.pop();
    const currentNode = currentItem.node;

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);

    if (currentNode === destination) {
      break;
    }

    const neighbors = graph.getNeighbors(currentNode);

    for (const edge of neighbors) {
      const tentativeGScore = (gScore.get(currentNode) ?? Number.POSITIVE_INFINITY) + edge.distance;
      const existingGScore = gScore.get(edge.to);

      if (tentativeGScore < (existingGScore ?? Number.POSITIVE_INFINITY)) {
        previous.set(edge.to, currentNode);
        gScore.set(edge.to, tentativeGScore);
        openSet.push({
          node: edge.to,
          distance: tentativeGScore + heuristic(edge.to),
        });
      }
    }
  }

  if (!gScore.has(destination)) {
    return {
      path: [],
      distance: Number.POSITIVE_INFINITY,
      estimatedTime: Number.POSITIVE_INFINITY,
      nodesExplored: visited.size,
      algorithm: 'A*',
      unreachable: true,
    };
  }

  const path = [];
  let currentNode = destination;

  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previous.get(currentNode);
  }

  const totalDistance = gScore.get(destination);
  const estimatedTime = Math.max(1, Math.round(totalDistance / 80));

  return {
    path,
    distance: totalDistance,
    estimatedTime,
    nodesExplored: visited.size,
    algorithm: 'A*',
  };
};

export default astar;
