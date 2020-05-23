import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import User from '../../models/User';
import { createToken } from '../../helpers/jwtHelper';
import Tokens from '../../models/Tokens';

export default class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    // Check if username and password are set
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user!: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    // Sing JWT, valid for 1 hour
    const token = createToken({ userId: user.id, username: user.username, email: user.email });

    // Send the jwt in the response
    res.set('x-api-token', token);
    res.status(200).send({ token });
  };

  static changePassword = async (req: Request, res: Response): Promise<void> => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user!: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (err) {
      console.error(err);
      res.status(401).send();
    }

    console.log(user.checkIfUnencryptedPasswordIsValid(oldPassword));

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }
    // Check if the new Password is the same as the Old Password
    if (user.checkIfUnencryptedPasswordIsValid(newPassword)) {
      res.status(401).send();
      return;
    }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
