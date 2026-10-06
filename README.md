# CampusRoute — Smart Campus Route Optimizer

CampusRoute is a simple MERN stack project that models a campus as a weighted graph and calculates the best walking route between two points using shortest-path algorithms. It is intentionally beginner-friendly and resume-ready, with clear separation of concerns, a lightweight MVC structure, and a manual Dijkstra/A* implementation.

## Project Overview

The app helps students or visitors find a practical route across campus. The graph is built from demo campus data, so the numbers are clearly sample values rather than verified real-world measurements. The goal is to demonstrate:

- MERN stack fundamentals
- weighted graph modeling
- adjacency-list graph representation
- priority queue / Min Heap
- Dijkstra shortest path
- A* heuristic search
- strategy-based algorithm selection
- REST API design
- clean MVC + service-layer structure

## Features

- shortest path between campus landmarks
- Dijkstra algorithm
- A* algorithm
- interactive Leaflet map
- route comparison between algorithms
- local browser route history
- MongoDB-backed location and edge persistence
- simple API layer and clean frontend dashboard

## Architecture Diagram

```text
Client (React + Vite)
    |
    v
REST API (Express.js)
    |
    v
Services + MVC Layers
    |
    +--> Graph Service
    +--> Route Service
    +--> MongoDB Models
    |
    +--> Algorithms: Dijkstra / A*
    +--> Strategy Pattern
```

## DSA Used

### Graph
The campus is modeled as a weighted graph where each location is a node and each walking path is an edge with a distance in meters.

### Adjacency List
The Graph class stores neighbors in an adjacency list:

```js
Map<Node, Edge[]>
```

This allows efficient neighbor lookup while keeping the logic easy to understand.

### Min Heap / Priority Queue
Dijkstra uses a custom binary Min Heap to always process the next lowest-distance node.

Dijkstra with binary heap:

- Time Complexity: O((V + E) log V)
- Space Complexity: O(V + E)

### Dijkstra
Dijkstra computes the shortest path from a source node to a target node by relaxing edges and tracking the smallest known distance.

### A*
A* is implemented separately and uses a geographic heuristic based on Haversine distance to guide the search toward the destination more efficiently.

### Path Reconstruction
After discovering the final destination, the algorithm reconstructs the route by walking backward through the previous-node map.

## LLD Concepts

### Strategy Pattern
The route logic uses interchangeable strategy objects:

- RouteStrategy
- DijkstraStrategy
- AStarStrategy

This keeps the algorithm selection independent from the service logic and demonstrates polymorphism and the Open/Closed Principle.

### MVC + Service Layer
The backend follows clean separation:

- Models: MongoDB schema definitions
- Controllers: request/response handling
- Services: business logic
- Algorithms: pure shortest-path logic
- Strategies: algorithm selection
- Graph: in-memory graph representation
- Utils: reusable helpers

## Complexity

Dijkstra:

- Time: O((V + E) log V)
- Space: O(V + E)

A*:

- Time depends on heuristic quality and graph structure
- In campus-style sparse graphs, it usually explores fewer nodes than Dijkstra

## API Documentation

### GET /api/locations
Returns all campus locations.

### GET /api/locations/:id
Returns one location by ID.

### POST /api/routes/find
Finds a route between two locations.

Example request:

```json
{
  "source": "locationId",
  "destination": "locationId",
  "algorithm": "dijkstra"
}
```

Example response:

```json
{
  "success": true,
  "algorithm": "Dijkstra",
  "path": ["Indus Hostel", "Main Gate", "Central Library", "Academic Block"],
  "distance": 1800,
  "estimatedTime": 22,
  "nodesExplored": 12
}
```

## Setup

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Root convenience scripts

```bash
npm run backend:install
npm run frontend:install
npm run backend:seed
npm run backend:dev
npm run frontend:dev
```

## Future Improvements

- verified campus coordinates and walking paths
- seasonal or blocked-path updates
- accessibility-aware route planning
- dynamic routing preferences based on user needs

## Notes

This project intentionally keeps the implementation simple, understandable, and interview-ready. The campus map and distances are demo values for educational use and can be replaced with verified location data in a real deployment.
