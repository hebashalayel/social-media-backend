const request = require('supertest');
const app = require('../server');

describe('API route checks', () => {
  it('should return API info from /api', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Social Media API');
    expect(response.body).toHaveProperty('endpoints');
  });

  it('should return 401 for protected auth route without token', async () => {
    const response = await request(app).get('/api/auth/users');
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Not authorized to access this route'
    });
  });
});
