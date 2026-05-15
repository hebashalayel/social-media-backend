const request = require('supertest');
const app = require('../server');

describe('Server health and API basic checks', () => {
  it('should return 200 OK from health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'OK' });
  });
});
