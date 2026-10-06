class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.hasNode(node)) {
      this.adjacencyList.set(node, []);
    }
    return this;
  }

  addEdge(from, to, distance, metadata = {}) {
    if (!this.hasNode(from)) {
      this.addNode(from);
    }

    if (!this.hasNode(to)) {
      this.addNode(to);
    }

    this.adjacencyList.get(from).push({
      to,
      distance,
      ...metadata,
    });

    return this;
  }

  getNeighbors(node) {
    if (!this.hasNode(node)) {
      return [];
    }
    return this.adjacencyList.get(node);
  }

  hasNode(node) {
    return this.adjacencyList.has(node);
  }

  getNodes() {
    return Array.from(this.adjacencyList.keys());
  }
}

export default Graph;
