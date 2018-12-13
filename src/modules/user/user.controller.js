import * as userValidation from './user.validation';
import {isEmpty} from '../../utils/isEmpty';
import sendEmail from '../../utils/mail';
import moment from 'moment';

// User model
import { User } from './user.model';

/**
 * @desc  Register user
 */
export const userSignup = async (req, res) => {
  let userData = req.body;

  // Check if user data is valid
  const { errors, isValid } = userValidation.validateSignup(userData);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check if username or email already exist
  let user = await User.find({
    $or: [{ username: userData.username }, { email: userData.email }]
  });
  if (user.length > 0) {
    return res.status(409).json({ message: 'Username or email already exist' });
  }

  // Register user
  try {
    await new User(userData).save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * @desc  Login user
 */
export const userLogin = async (req, res) => {
  let userCredentials = req.body;

  // Check if user data is valid
  const { errors, isValid } = userValidation.validateLogin(userCredentials);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check if user exist
  let user = await User.findOne({ username: userCredentials.username });
  if (isEmpty(user)) {
    return res.status(404).json({ message: 'Invalid username or password' });
  }

  // Check if password match
  let isMatch = await user.comparePassword(userCredentials.password);
  if (!isMatch) {
    return res.status(404).json({ message: 'Invalid username or password' });
  }

  try {
    // Generate and save token
    let userSaved = await user.generateToken();

    // Send token to client
    res
      .cookie('auth_token', userSaved.token)
      .status(200)
      .send({ logingSuccess: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * @desc  Logout user
 */
export const userLogout = async (req, res) => {
  let { _id } = req.user;
  try {
    await await User.findOneAndUpdate({ _id }, { token: '' });
    res.send({ logoutSuccess: true });
  } catch (err) {
    res.status(400).send(err);
  }
};


/**
 * @desc  Generate token and send it to user for reset password
 */
export const resetUser = async (req,res) => {
  let { email,name } = req.user;

  // check if user exist
  let user = await User.findOne({ email });
  if (isEmpty(user)) {
    return res.status(404).json({ message: 'Invalid email' });
  }

  try {
    let { token_reset } = await user.generateResetToken
    sendEmail(email,name,'reset-password',token_reset);
    res.send({succes:true})
  } catch (err) {
    res.status(500).send(err)
  }
}


/**
 * @desc  Reset user password
*/
export const resetPassword = async (req,res) => {

  // Check if user data is valid
  const { errors, isValid } = userValidation.validateResetPassword(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const today = moment().startOf('day').valueOf();
  const { token_reset,password } = req.body;

  // check if user exist
  let user = await User.findOne({
    token_reset,
    token_reset_exp: {
      $gte: today
    }
  });
  if (Object.values(user).length == 0) {
    return res.status(400).json({ message: 'Sorry, bad token, generate a new token' });
  }

  user.password = password;
  user.token_reset = '';
  user.token_reset_exp = '';

  try {
    await user.save();
    res.send({succes:true})
  } catch (err) {
    res.status(500).send(err)
  }

}