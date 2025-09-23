// THis is a test file used to test app.js HTTP requests
const supertest = require('supertest');
const app = require('../../src/app');

describe('app.js 404 handler', () => {
  test('should return 404 for unknown route', async () => {
    await supertest(app).get('/sike_thatsthewrongnumbah').expect(404);
  });
});
