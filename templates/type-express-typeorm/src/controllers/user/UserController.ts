import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import User from '../../models/User';

class UserController {
  static listAll = async (req: Request, res: Response): Promise<void> => {
    // Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'username', 'role', 'email'], // We dont want to send the passwords on response
    });

    // Send the users object
    res.status(200).send(users);
  };

  static getOneById = async (req: Request, res: Response): Promise<void> => {
    // Get the ID from the url
    const { id } = req.params;

    // Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ['id', 'username', 'role'], // We dont want to send the password on response
      });
      res.status(200).send(user);
    } catch (error) {
      res.status(404).send('User not found');
    }
  };

  static newUser = async (req: Request, res: Response): Promise<void> => {
    // Get parameters from the body
    const {
      username, password, role, email,
    } = req.body;
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    user.role = role;

    // Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Hash the password, to securely store on DB
    user.hashPassword();

    // Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({ error: e, message: 'username already in use' });
      return;
    }

    // If all ok, send 201 response
    res.status(201).send({ status: 200, message: 'User created' });
  };

  static editUser = async (req: Request, res: Response): Promise<void> => {
    // Get the ID from the url
    const { id } = req.params;

    // Get values from the body
    const { username, role, email } = req.body;

    // Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      // If not found, send a 404 response
      res.status(404).send('User not found');
      return;
    }

    // Validate the new values on model
    user.username = username || user.username;
    user.role = role || user.role;
    user.email = email || user.email;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }
    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    // Get the ID from the url
    const { id } = req.params;

    const userRepository = getRepository(User);
    try {
      await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    userRepository.delete(id);

    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UserController;
