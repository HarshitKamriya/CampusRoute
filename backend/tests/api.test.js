import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import routeService from '../src/services/routeService.js';

test('Successful route request returns 200', async () => {
  const originalFindRoute = routeService.findRoute;
  routeService.findRoute = async () => ({
    success: true,
    algorithm: 'Dijkstra',
    path: ['Indus Hostel', 'Main Gate'],
    distance: 540,
    estimatedTime: 7,
    nodesExplored: 2,
  });

  try {
    const response = await request(app)
      .post('/api/routes/find')
      .send({ source: '66c3c1d52c8f68f86df4cb12', destination: '66c3c1d52c8f68f86df4cb13', algorithm: 'dijkstra' });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.algorithm, 'Dijkstra');
    assert.deepEqual(response.body.path, ['Indus Hostel', 'Main Gate']);
  } finally {
    routeService.findRoute = originalFindRoute;
  }
});

test('Invalid location input is rejected', async () => {
  const response = await request(app)
    .post('/api/routes/find')
    .send({ source: '', destination: '66c3c1d52c8f68f86df4cb13', algorithm: 'dijkstra' });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /required/i);
});

test('Invalid algorithm is rejected', async () => {
  const response = await request(app)
    .post('/api/routes/find')
    .send({ source: '66c3c1d52c8f68f86df4cb12', destination: '66c3c1d52c8f68f86df4cb13', algorithm: 'floyd' });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /invalid algorithm/i);
});
