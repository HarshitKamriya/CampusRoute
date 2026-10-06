import test from 'node:test';
import assert from 'node:assert/strict';
import Graph from '../src/graph/Graph.js';

test('Graph adds nodes and edges correctly', () => {
  const graph = new Graph();

  graph.addNode('A');
  graph.addNode('B');
  graph.addEdge('A', 'B', 10);

  assert.equal(graph.hasNode('A'), true);
  assert.equal(graph.hasNode('C'), false);
  assert.deepEqual(graph.getNodes().sort(), ['A', 'B']);
  assert.deepEqual(graph.getNeighbors('A'), [{ to: 'B', distance: 10 }]);
});
