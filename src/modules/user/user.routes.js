import express from 'express';
import * as userController from './user.controller';
import { authenticationRequired } from '../../middlewares/auth';

const router = express.Router();

/**
 * @route  POST /api/users/register
 * @desc   Register user
 * @access Public
 */
router.post('/register', userController.userSignup);

/**
 * @route  POST /api/users/login
 * @desc   Login user
 * @access Public
 */
router.post('/login', userController.userLogin);

/**
 * @route  POST /api/users/reset-user
 * @desc   Generate token and send it to user for reset password
 * @access Public
 */
router.get('/reset-user', userController.resetUser);


/**
 * @route  POST /api/users/reset-password
 * @desc   reset user password
 * @access Public
 */
router.get('/reset-password', userController.resetPassword);

/**
 * @route  POST /api/users/logout
 * @desc   Logout user
 * @access Private
 */
router.get('/logout', authenticationRequired, userController.userLogout);


// ----------------> REMOVE FOR PRODUCTION MODE
/**
 * @route  POST /api/users/ping
 * @desc   Testing auth - Temporal route
 * @access Private
 */
router.get('/ping', authenticationRequired, (req, res) => {
  res.send('Pong');
});

export default router;
