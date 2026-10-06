import test from 'node:test';
import assert from 'node:assert/strict';
import Graph from '../src/graph/Graph.js';
import dijkstra from '../src/algorithms/dijkstra.js';

test('Dijkstra returns shortest route', () => {
  const graph = new Graph();

  graph.addEdge('A', 'B', 4);
  graph.addEdge('A', 'C', 2);
  graph.addEdge('B', 'D', 3);
  graph.addEdge('C', 'B', 1);
  graph.addEdge('C', 'D', 5);
  graph.addEdge('D', 'C', 5);

  const result = dijkstra(graph, 'A', 'D');

  assert.equal(result.algorithm, 'Dijkstra');
  assert.deepEqual(result.path, ['A', 'C', 'B', 'D']);
  assert.equal(result.distance, 6);
  assert.equal(result.nodesExplored, 4);
});

test('Dijkstra handles source equals destination', () => {
  const graph = new Graph();
  graph.addNode('A');

  const result = dijkstra(graph, 'A', 'A');

  assert.equal(result.distance, 0);
  assert.deepEqual(result.path, ['A']);
});

test('Dijkstra handles unreachable destination', () => {
  const graph = new Graph();
  graph.addNode('A');
  graph.addNode('B');

  const result = dijkstra(graph, 'A', 'B');

  assert.equal(result.unreachable, true);
  assert.equal(result.distance, Number.POSITIVE_INFINITY);
});

test('Dijkstra handles invalid node', () => {
  const graph = new Graph();
  graph.addNode('A');

  const result = dijkstra(graph, 'A', 'Z');

  assert.equal(result, null);
});
