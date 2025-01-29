const request = require('supertest');
const { startServer, stopServer } = require('../testServer');

let server;

beforeAll(async () => {
    server = await startServer();
});

afterAll(async () => {
    await stopServer();
});

describe('Count Items Endpoint', () => {
    test('should return the count of items', async () => {
        const response = await request(server).get('/count-items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('count');
    }, 15000); // Increase test timeout
});