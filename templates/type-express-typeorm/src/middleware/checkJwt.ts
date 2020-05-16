
import e, { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import JWTInterface from '../interfaces/JWTInterface';
import { errorMessage } from '../helpers/consoleSyle';
import { createToken, verifyToken } from '../helpers/jwtHelper';
import Tokens from '../models/Tokens';

export default (req: Request, res: Response, next: NextFunction): void => {
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

  getRepository(Tokens).findOneOrFail({
    where: [
      { value: token },
    ],
  })
    .then((resToken) => {
      if (resToken.revoked) {
        res.status(401).send({ error: 'this token is revoked' });
      }
    })
    .catch((err) => {
      console.error(err);
    });


  // The token is valid for 1 hour
  // We want to send a new token on every request
  const { userId, username, email } = jwtPayload;
  const newToken = createToken({ userId, username, email });
  res.setHeader('x-api-token', newToken);

  // Call the next middleware or controller
  next();
};
