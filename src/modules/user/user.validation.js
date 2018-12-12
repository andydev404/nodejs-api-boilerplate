import Validator from 'validator';
import {isEmpty} from '../../utils/isEmpty';

/**
 * @desc   Validate signup data
 * @param  {Object} user 
 * @return {Object}
 */
export const validateSignup = (user) => {
  let errors = {};

  user.name = !isEmpty(user.name) ? user.name: '';
  user.username = !isEmpty(user.username) ? user.username: '';
  user.email = !isEmpty(user.email) ? user.email: '';
  user.password = !isEmpty(user.password) ? user.password: '';

  if(Validator.isEmpty(user.name)){
    errors.name = 'Name field is required';
  }

  if(Validator.isEmpty(user.username)){
    errors.username = 'Username field is required';
  }

  if (!Validator.isLength(user.username, { min: 3, max: 30 })) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if(Validator.isEmpty(user.password)){
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(user.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if(Validator.isEmpty(user.email)){
    errors.email = 'Email field is required';
  }
  
  if(!Validator.isEmail(user.email)){
    errors.email = 'Email is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * @desc   Validate login data
 * @param  {Object} user 
 * @return {Object}
 */
export const validateLogin = (user) => {
  let errors = {};

  user.username = !isEmpty(user.username) ? user.username: '';
  user.password = !isEmpty(user.password) ? user.password: '';

  if(Validator.isEmpty(user.username)){
    errors.username = 'Username field is required';
  }
  
  if(Validator.isEmpty(user.password)){
    errors.password = 'Password field is required';
  }
  

  return {
    errors,
    isValid: isEmpty(errors)
  }
}


/**
 * @desc   Validate reset password body
 * @param  {Object} user 
 * @return {Object}
 */
export const validateResetPassword = (user) => {
  let errors = {};

  user.token_reset = !isEmpty(user.token_reset) ? user.token_reset : '';
  user.password = !isEmpty(user.password) ? user.password : '';

  if (Validator.isEmpty(user.token_reset)) {
    errors.token_reset = 'Token must be provided';
  }

  if (Validator.isEmpty(user.password)) {
    errors.password = 'Password field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
