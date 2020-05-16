import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import JWTInterface from '../interfaces/JWTInterface';
import config from '../config/config';
import Tokens from '../models/Tokens';

export const createToken = (jwtPayload: JWTInterface): string => {
  const token = jwt.sign(jwtPayload, config.jwtSecret, {
    expiresIn: '1h',
  });
  return token;
};

export const revokeToken = async (tokenToRevoke: string): Promise<void> => {
  const tokenRepository = await getRepository(Tokens);
  let token;
  try {
    token = await tokenRepository.findOneOrFail({
      where: [
        { value: tokenToRevoke },
      ],
    });
  } catch (error) {
    throw new Error('Cannot Find Token');
  }
  token.revoked = true;

  try {
    await tokenRepository.save(token);
  } catch (error) {
    throw new Error('Could Not Revoke Token');
  }
};
export const verifyToken = (token: string): string | object => jwt.verify(token, config.jwtSecret);
