const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
describe('PUT /v1/fragments', () => {
  test('GET /v1/fragments route exists', async () => {
    const res = await request(app).get('/v1/fragments');
    console.log(res.statusCode, res.body);
  });

  test('put without Content-Type header returns 400 error', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .type('text/plain')
      .send('hello');
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    // Don't set Content-Type header to trigger the missing header error
    const putRes = await request(app)
      .put(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1')
      .send('hello updated');
    expect(putRes.statusCode).toBe(400);
    expect(putRes.body.status).toBe('error');
  });

  test('put after post returns the updated fragment with updated metadata with wrong content type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .type('text/plain')
      .send('hello');
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const putRes = await request(app)
      .put(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1')
      .type('application/json')
      .send(JSON.stringify({ data: 'hello updated' }));
    expect(putRes.statusCode).toBe(400);
    expect(putRes.body.status).toBe('error');
  });

  test('string put after post returns the updated fragment with updated metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .type('text/plain')
      .send('hello');
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const putRes = await request(app)
      .put(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1')
      .type('text/plain')
      .send('hello updated');
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
    expect(putRes.body.data.size).toBeGreaterThan(0);
    expect(putRes.body.data.updated).toBeDefined();
  });

  test('json put after post returns the updated fragment with updated metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .type('application/json')
      .send(JSON.stringify({ data: 'hello' }));
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const putRes = await request(app)
      .put(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1')
      .type('application/json')
      .send(JSON.stringify({ data: 'hello updated' }));
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
    expect(putRes.body.data.size).toBeGreaterThan(0);
    expect(putRes.body.data.updated).toBeDefined();

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.data.data.data.toString()).toBe('hello updated');
  });

  test('img put after post returns the updated fragment with updated metadata', async () => {
    // Load the actual test PNG image
    const originalImagePath = path.join(__dirname, '../../testimg/testPNG.png');
    const originalImageData = fs.readFileSync(originalImagePath);

    const modifiedImagePath = path.join(__dirname, '../../testimg/testPNG2.png');
    const modifiedImageData = fs.readFileSync(modifiedImagePath);

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .type('image/png')
      .send(originalImageData);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const putRes = await request(app)
      .put(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1')
      .type('image/png')
      .send(modifiedImageData);
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
    expect(putRes.body.data.size).toBe(modifiedImageData.length);
    expect(putRes.body.data.updated).toBeDefined();

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');

    // Image data is returned as base64 string, so convert back to compare
    const retrievedImageData = Buffer.from(getRes.body.data.data, 'base64');
    expect(retrievedImageData.length).toBe(modifiedImageData.length);
    expect(retrievedImageData).toEqual(modifiedImageData);
  });
});
