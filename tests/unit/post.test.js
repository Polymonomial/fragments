const request = require('supertest');
const app = require('../../src/app');
describe('POST /v1/fragments', () => {
  test('GET /v1/fragments route exists', async () => {
    const res = await request(app).get('/v1/fragments');
    console.log(res.statusCode, res.body);
  });
  test('post with basic auth returns 200', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    console.log(`this is res: `, res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('post with no auth returns 401', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send({ type: 'text/plain', data: 'hello' });
    expect(res.statusCode).toBe(401);
  });

  test('post with missing type required fields returns 400', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('get after post returns the posted fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.data).toEqual('hello');
  });
});
