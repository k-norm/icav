const request = require('supertest');
const app = require('./server');

test('GET / returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/ICAV Project/);
});
