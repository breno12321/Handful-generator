import supertest from 'supertest';
import { createConnection, Connection } from 'typeorm';
import app from '../../app';

const request = supertest(app);


describe('Authentication test suit', (): void => {
  let token: string;
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    connection.close();
  });

  it('Should Login Admin user', async () => {
    const res = await request.post('/auth/login').send({
      username: 'admin',
      password: 'admin',
    });
    expect(res.status).toBe(200);
    console.log(res.body.token);
    token = res.body.token;
  });
  it('Should fail to change the password / same password', async () => {
    const res = await request.post('/auth/changePassword').set('x-api-key', token).send({ oldPassword: 'admin', newPassword: 'admin' });
    expect(res.status).toBe(401);
  });
});
