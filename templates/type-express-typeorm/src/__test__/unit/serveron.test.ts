import supertest from 'supertest';
import app from '../../app';

const request = supertest(app);

describe('Server Bootup', (): void => {
  it('Should Start the server and get status', async () => {
    const res = await request.get('/status');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
  });
});
