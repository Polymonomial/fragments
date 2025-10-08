const request = require('supertest');
const app = require('../../src/app');
describe('POST /v1/fragments', () => {
  // Using a valid username/password pair should give a success result with a .fragments array
  // let jwt;
  // beforeAll(async () => {
  //   jwt = await getCognitoIdToken({
  //     username: 'bchang16@myseneca.ca',
  //     password: '6ABrendan08.',
  //   });
  // });
  test('post with basical auth returns 200', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    expect(res.body.status).toBe('ok');
    expect(res.statusCode).toBe(201);
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
    expect(getRes.body.data).toEqual(postRes.body.data);
  });
});
