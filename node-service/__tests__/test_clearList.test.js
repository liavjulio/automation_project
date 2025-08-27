const request = require('supertest');
const { startServer, stopServer } = require('../testServer');

let server;

beforeAll(async () => {
    server = await startServer();
});

afterAll(async () => {
    await stopServer();
});

describe('Clear List Endpoint', () => {
    test('should clear all items from the list', async () => {
        const response = await request(server).delete('/clear-list');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('items cleared from the list');
    });
});