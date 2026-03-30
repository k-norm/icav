/* eslint-env jest */

const request = require('supertest');
const app = require('./server');
 
// -- Route tests --

describe('GET /', () => {
    test('returns 200', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });
 
    test('renders ICAV heading', async () => {
        const res = await request(app).get('/');
        expect(res.text).toContain('<h1>ICAV</h1>');
    });
 
    test('contains links to all main routes', async () => {
        const res = await request(app).get('/');
        expect(res.text).toContain('/chart/condition');
        expect(res.text).toContain('/chart/comparison');
        expect(res.text).toContain('/chart/scatter');
        expect(res.text).toContain('/table/condition');
        expect(res.text).toContain('/stats/condition');
    });
});
 
describe('GET /chart/condition', () => {
    test('returns 200', async () => {
        const res = await request(app).get('/chart/condition');
        expect(res.statusCode).toBe(200);
    });
 
    test('renders stacked bar chart page', async () => {
        const res = await request(app).get('/chart/condition');
        expect(res.text).toContain('Facility Condition Distribution by Province');
    });
 
    test('contains condition category definitions', async () => {
        const res = await request(app).get('/chart/condition');
        expect(res.text).toContain('Excellent');
        expect(res.text).toContain('Good');
        expect(res.text).toContain('Fair');
        expect(res.text).toContain('Poor');
    });
 
    test('fetches data from condition API endpoint', async () => {
        const res = await request(app).get('/chart/condition');
        expect(res.text).toContain('/api/facilities/condition');
    });
});
 
describe('GET /chart/scatter', () => {
    test('returns 200', async () => {
        const res = await request(app).get('/chart/scatter');
        expect(res.statusCode).toBe(200);
    });
 
    test('renders scatter plot page', async () => {
        const res = await request(app).get('/chart/scatter');
        expect(res.text).toContain('Facility Accessibility vs Condition Analysis');
    });
 
    test('fetches data from scatter API endpoint', async () => {
        const res = await request(app).get('/chart/scatter');
        expect(res.text).toContain('/api/facilities/scatter');
    });
 
    test('contains axis labels for accessibility and condition', async () => {
        const res = await request(app).get('/chart/scatter');
        expect(res.text).toContain('% Accessible Facilities');
        expect(res.text).toContain('% Facilities in Poor Condition');
    });
});

describe('GET /chart/comparison', () => {
    test('returns 200', async () => {
        const res = await request(app).get('/chart/comparison');
        expect(res.statusCode).toBe(200);
    });

    test('renders comparison line chart page', async () => {
        const res = await request(app).get('/chart/comparison');
        expect(res.text).toContain('Good Condition vs Accessibility Comparison');
    });

    test('fetches joined condition and accessibility stats endpoints', async () => {
        const res = await request(app).get('/chart/comparison');
        expect(res.text).toContain('/api/facilities/stats');
        expect(res.text).toContain('/api/facilities/accessibility/stats');
    });

    test('contains axis labels for condition and accessibility', async () => {
        const res = await request(app).get('/chart/comparison');
        expect(res.text).toContain('Good Condition (%)');
        expect(res.text).toContain('Accessibility (%)');
    });
});
 
describe('GET /table/condition', () => {
    test('returns 200', async () => {
        const res = await request(app).get('/table/condition');
        expect(res.statusCode).toBe(200);
    });
 
    test('renders table page', async () => {
        const res = await request(app).get('/table/condition');
        expect(res.text).toContain('Facility Condition Data Table');
    });
 
    test('fetches data from condition API endpoint', async () => {
        const res = await request(app).get('/table/condition');
        expect(res.text).toContain('/api/facilities/condition');
    });
});
 
describe('GET /stats/condition', () => {
    test('returns 200', async () => {
        const res = await request(app).get('/stats/condition');
        expect(res.statusCode).toBe(200);
    });
 
    test('renders statistics page', async () => {
        const res = await request(app).get('/stats/condition');
        expect(res.text).toContain('Facility Condition Statistics');
    });
 
    test('fetches data from stats API endpoint', async () => {
        const res = await request(app).get('/stats/condition');
        expect(res.text).toContain('/api/facilities/stats');
    });
});
 
describe('Unknown routes', () => {
    test('returns 404 for unknown route', async () => {
        const res = await request(app).get('/does-not-exist');
        expect(res.statusCode).toBe(404);
    });
});
 
// -- Proxy tests --
 
describe('API proxy', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
 
    afterEach(() => {
        jest.resetAllMocks();
    });
 
    test('proxies GET /api/facilities/condition to backend', async () => {
        global.fetch.mockResolvedValueOnce({
            status: 200,
            text: async () => JSON.stringify([{ province: 'ON', excellent: 120, good: 200, fair: 80, poor: 30 }]),
            headers: { forEach: jest.fn() },
        });
 
        const res = await request(app).get('/api/facilities/condition');
        expect(res.statusCode).toBe(200);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/facilities/condition'),
            expect.any(Object)
        );
    });
 
    test('returns 502 when backend is unreachable', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Connection refused'));
 
        const res = await request(app).get('/api/facilities/condition');
        expect(res.statusCode).toBe(502);
        expect(res.body.message).toBe('Bad gateway');
    });
 
    test('proxies GET /api/facilities/stats to backend', async () => {
        global.fetch.mockResolvedValueOnce({
            status: 200,
            text: async () => JSON.stringify([]),
            headers: { forEach: jest.fn() },
        });
 
        await request(app).get('/api/facilities/stats');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/facilities/stats'),
            expect.any(Object)
        );
    });
 
    test('proxies GET /api/facilities/scatter to backend', async () => {
        global.fetch.mockResolvedValueOnce({
            status: 200,
            text: async () => JSON.stringify([]),
            headers: { forEach: jest.fn() },
        });
 
        await request(app).get('/api/facilities/scatter');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/facilities/scatter'),
            expect.any(Object)
        );
    });
 
    test('forwards backend status code to client', async () => {
        global.fetch.mockResolvedValueOnce({
            status: 404,
            text: async () => 'Not found',
            headers: { forEach: jest.fn() },
        });
 
        const res = await request(app).get('/api/facilities/condition');
        expect(res.statusCode).toBe(404);
    });
});
