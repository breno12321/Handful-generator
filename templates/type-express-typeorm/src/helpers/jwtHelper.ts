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
  const token = new Tokens();
  token.revoked = true;
  token.value = tokenToRevoke;
  try {
    await tokenRepository.save(token);
  } catch (error) {
    throw new Error('Cannot Revoke Token');
  }
};
export const verifyToken = (token: string): string | unknown => jwt.verify(token, config.jwtSecret);
