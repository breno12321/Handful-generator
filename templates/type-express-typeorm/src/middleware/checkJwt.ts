import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import JWTInterface from '../interfaces/JWTInterface';
import { errorMessage } from '../helpers/consoleSyle';
import { verifyToken } from '../helpers/jwtHelper';
import Tokens from '../models/Tokens';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Get the jwt token from the head
  const token = req.headers['x-api-key'] as string;
  let jwtPayload!: JWTInterface;

  // Try to validate the token and get data
  try {
    jwtPayload = verifyToken(token) as JWTInterface;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
    errorMessage(error);
    res.status(401).send();
  }

  try {
    await getRepository(Tokens).findOneOrFail({ where: [{ value: token }] });
    res.status(401).send({ error: 'this token is revoked' });
  } catch (error) {
    // The token is valid for 1 hour
    next();
  }
};
