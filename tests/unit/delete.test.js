const request = require('supertest');
const app = require('../../src/app');
describe('DELETE /v1/fragments', () => {
  test('GET /v1/fragments route exists', async () => {
    const res = await request(app).get('/v1/fragments');
    console.log(res.statusCode, res.body);
  });
  test('get after post returns the posted fragment and get after delete returns 404', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .type('text/plain')
      .send('hello');
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.data.data).toEqual('hello');

    const deleteRes = await request(app)
      .delete(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);

    const getAfterDeleteRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1');
    expect(getAfterDeleteRes.statusCode).toBe(404);
  });
});
