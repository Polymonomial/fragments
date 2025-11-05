// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app.js');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get all user fragments', async () => {
    const getRes = await request(app).get(`/v1/fragments`).auth('user1@email.com', 'password1');
    expect(getRes.body.status).toBe('ok');
    expect(getRes.statusCode).toBe(200);
  });

  // Using a valid username/password pair with expand=1 should give a success result with a .fragments array
  test('authenticated users get all user fragments with expanded details and metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');
    const getRes = await request(app)
      .get(`/v1/fragments?expand=1`)
      .auth('user1@email.com', 'password1');
    expect(getRes.body.status).toBe('ok');
    expect(getRes.statusCode).toBe(200);
  });
  // TODO: we'll need to add tests to check the contents of the fragments array later
});
