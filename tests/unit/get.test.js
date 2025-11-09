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
    console.log(getRes.body.data);
  });

  // Using a valid username/password pair with specific fragment id should give a success result with a fragment object
  test('authenticated users get specific fragment with given fragment id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');
    const fragmentId = postRes.body.data.id;
    //const fragmentdata = postRes.body.data;
    //console.log('Created fragment with ID:', fragmentdata);
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.body.status).toBe('ok');
    expect(getRes.statusCode).toBe(200);
    console.log('Retrieved freg:', getRes.body.data);
    expect(getRes.body.data.data.toString()).toBe('hello');
    console.log(getRes.body.data);
  });

  test('authenticated users get specific fragment with given fragment id with markdown converted to html', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# hello');
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');
    const fragmentId = postRes.body.data.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.md`)
      .auth('user1@email.com', 'password1');
    expect(getRes.body.status).toBe('ok');
    expect(getRes.statusCode).toBe(200);
    console.log('Retrieved freg:', getRes.body.data);
    expect(getRes.body.data.data.toString()).toBe('<h1>hello</h1>');
    console.log(getRes.body.data);
  });

  test('authenticated users get specific fragment with given fragment id with /info sub-route that gives metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');
    const fragmentId = postRes.body.data.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1');
    expect(getRes.body.status).toBe('ok');
    expect(getRes.statusCode).toBe(200);
    console.log('Retrieved freg:', getRes.body.data);
    expect(getRes.body.data.id).toBe(fragmentId);
    console.log(getRes.body.data);
  });
  // TODO: we'll need to add tests to check the contents of the fragments array later
});
