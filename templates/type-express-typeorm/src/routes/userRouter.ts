import express from 'express';
import UserController from '../controllers/user/UserController';
import checkJwt from '../middleware/checkJwt';
import checkRole from '../middleware/checkRole';
// const sensorController = require('../controllers/sensorController');


const router = express.Router();

// Get all users
router.get('/', [checkJwt, checkRole(['ADMIN'])], UserController.listAll);

// Get one user
router.get(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.getOneById,
);

// Create a new user
router.post('/', [checkJwt, checkRole(['ADMIN'])], UserController.newUser);

// Edit one user
router.patch(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.editUser,
);

// Delete one user
router.delete(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.deleteUser,
);

export default router;
