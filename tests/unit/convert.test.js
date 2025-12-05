const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
describe('POST /v1/fragments', () => {
  test('GET /v1/fragments route exists', async () => {
    const res = await request(app).get('/v1/fragments');
    console.log(res.statusCode, res.body);
  });

  test.each([
    ['.png', 'image/png', ['image/png'], 'image/png'],
    ['.gif', 'image/gif', ['image/gif'], 'image/gif'],
    ['.jpg', 'image/jpeg', ['image/jpeg'], 'image/jpeg'],
    ['.webp', 'image/webp', ['image/webp'], 'image/webp'],
    ['.avif', 'image/avif', ['image/avif'], 'image/avif'],
  ])('conversion testing for image %s', async (ext, mimeType, formats, expectedType) => {
    // Load the PNG test image as a Buffer
    const pngImagePath = path.join(__dirname, '../../testimg/testPNG.png');
    const pngImageData = fs.readFileSync(pngImagePath);

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(pngImageData);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}${ext}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.data.contentType).toBe(expectedType);

    const getResWrong = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}.wrong`)
      .auth('user1@email.com', 'password1');
    expect(getResWrong.statusCode).toBe(415);
    expect(getResWrong.body.status).toBe('error');
  });

  test.each([
    ['.txt', 'text/plain', 'text/plain', '# Hello World'], // markdown -> plain text
    ['.html', 'text/markdown', 'text/html', '# Hello World'], // markdown -> html
    ['.csv', 'text/csv', 'text/csv', 'name,age\nJohn,25'], // csv -> csv
    ['.md', 'text/markdown', 'text/markdown', '# Hello World'], // markdown -> markdown (using .md not .markdown)
  ])('conversion testing for text %s', async (ext, sourceType, expectedType, testData) => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', sourceType)
      .send(testData);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}${ext}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.data.contentType).toBe(expectedType);
  });

  test.each([
    ['.json', 'application/json', 'application/json', '{"key": "value"}'],
    ['.yaml', 'application/json', 'application/yaml', '{"key": "value"}'], // JSON -> YAML conversion
  ])('conversion testing for application %s', async (ext, sourceType, expectedType, testData) => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', sourceType)
      .send(testData);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.data.id}${ext}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.data.contentType).toBe(expectedType);
  });
});
