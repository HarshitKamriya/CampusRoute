import Edge from '../models/Edge.js';
import Location from '../models/Location.js';
import Graph from '../graph/Graph.js';

class GraphService {
  constructor() {
    this.graph = null;
    this.locationsById = null;
  }

  async buildGraph() {
    const [locations, edges] = await Promise.all([
      Location.find().sort({ name: 1 }).lean(),
      Edge.find().lean(),
    ]);

    const graph = new Graph();
    const locationsById = {};

    for (const location of locations) {
      locationsById[location._id.toString()] = location;
      graph.addNode(location.name);
    }

    for (const edge of edges) {
      const fromLocation = locationsById[edge.from.toString()];
      const toLocation = locationsById[edge.to.toString()];

      if (!fromLocation || !toLocation) {
        continue;
      }

      graph.addEdge(fromLocation.name, toLocation.name, edge.distance, {
        fromId: edge.from,
        toId: edge.to,
        estimatedTime: edge.estimatedTime,
      });

      graph.addEdge(toLocation.name, fromLocation.name, edge.distance, {
        fromId: edge.to,
        toId: edge.from,
        estimatedTime: edge.estimatedTime,
      });
    }

    this.graph = graph;
    this.locationsById = locationsById;

    return { graph, locationsById };
  }

  async getGraph() {
    if (!this.graph) {
      await this.buildGraph();
    }

    return { graph: this.graph, locationsById: this.locationsById };
  }

  clearCache() {
    this.graph = null;
    this.locationsById = null;
  }
}

export default new GraphService();
