import MinHeap from './MinHeap.js';

const dijkstra = (graph, source, destination) => {
  if (!graph || !graph.hasNode(source) || !graph.hasNode(destination)) {
    return null;
  }

  if (source === destination) {
    return {
      path: [source],
      distance: 0,
      estimatedTime: 0,
      nodesExplored: 1,
      algorithm: 'Dijkstra',
    };
  }

  const distances = new Map();
  const previous = new Map();
  const visited = new Set();
  const heap = new MinHeap();

  distances.set(source, 0);
  heap.push({ node: source, distance: 0 });

  while (!heap.isEmpty()) {
    const currentItem = heap.pop();
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
      const tentativeDistance = distances.get(currentNode) + edge.distance;
      const existingDistance = distances.get(edge.to);

      if (tentativeDistance < (existingDistance ?? Number.POSITIVE_INFINITY)) {
        distances.set(edge.to, tentativeDistance);
        previous.set(edge.to, currentNode);
        heap.push({ node: edge.to, distance: tentativeDistance });
      }
    }
  }

  if (!distances.has(destination)) {
    return {
      path: [],
      distance: Number.POSITIVE_INFINITY,
      estimatedTime: Number.POSITIVE_INFINITY,
      nodesExplored: visited.size,
      algorithm: 'Dijkstra',
      unreachable: true,
    };
  }

  const path = [];
  let currentNode = destination;

  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previous.get(currentNode);
  }

  const totalDistance = distances.get(destination);
  const estimatedTime = Math.max(1, Math.round(totalDistance / 80));

  return {
    path,
    distance: totalDistance,
    estimatedTime,
    nodesExplored: visited.size,
    algorithm: 'Dijkstra',
  };
};

export default dijkstra;
