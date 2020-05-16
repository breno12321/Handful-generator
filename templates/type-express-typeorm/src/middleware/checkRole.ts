
import {
  Request, Response, NextFunction,
} from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

// eslint-disable-next-line max-len
export default (roles: Array<string>) => async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Get the user ID from previous midleware
  const id = res.locals.jwtPayload.userId;

  // Get user role from the database
  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);

    // Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  } catch (err) {
    console.error(err);
    res.status(401).send();
  }
};
