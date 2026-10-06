class RouteStrategy {
  findRoute() {
    throw new Error('RouteStrategy.findRoute must be implemented by a subclass.');
  }
}

export default RouteStrategy;
