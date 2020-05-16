import { createToken, verifyToken } from '../../helpers/jwtHelper';
import JWTInterface from '../../interfaces/JWTInterface';

let token: string;

describe('JWT Validations', (): void => {
  it('Should Sign a JWT', async () => {
    const reqData: JWTInterface = { userId: 1, username: 'name', email: 'email@email.com' };
    token = createToken(reqData);
    expect(token).toEqual(expect.stringContaining('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
    // expect(verifyToken(token)).toEqual(reqData);
  });

  it('Should verify a JWT', async () => {
    expect(verifyToken(token)).toHaveProperty(['userId'], 1);
    expect(verifyToken(token)).toHaveProperty(['username'], 'name');
    expect(verifyToken(token)).toHaveProperty(['email'], 'email@email.com');
  });
});
