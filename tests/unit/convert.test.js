const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
describe('POST /v1/fragments', () => {
  test('GET /v1/fragments route exists', async () => {
    const res = await request(app).get('/v1/fragments');
    console.log(res.statusCode, res.body);
  });
  test('image conversion all image types with basic auth returns 200', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ type: 'text/plain', data: 'hello' });
    console.log(`this is res: `, res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test.each([
    ['.png', 'image/png', ['image/png'], 'image/png'],
    ['.gif', 'image/gif', ['image/gif'], 'image/gif'],
    ['.jpg', 'image/jpeg', ['image/jpeg'], 'image/jpeg'],
    ['.webp', 'image/webp', ['image/webp'], 'image/webp'],
    ['.avif', 'image/avif', ['image/avif'], 'image/avif'],
  ])('image %s', async (ext, mimeType, formats, expectedType) => {
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

  //test('get after ');
});
