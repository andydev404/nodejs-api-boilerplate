import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    minlength: 3
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 70
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  notification: {
    type: Boolean,
    default: false
  },
  token: String,
  token_reset: String,
  token_reset_exp: Number
});

/**
 * @desc  Hash user password
 */
userSchema.pre('save',function(next){
  let userData = this;
  let saltRounds = 10;

  if(userData.isModified('password')){
    bcrypt.hash(userData.password, saltRounds).then(passwordHashed => {
      userData.password = passwordHashed;
      next();
    }).catch(err => next(err));
  }else{
    next();
  }
});

/**
 * @desc   Check is password match
 * @param  {String} plainPassword
 * @return {Boolean} isMatch
 */
userSchema.methods.comparePassword = function(plainPassword){
  let userData = this;
  return new Promise((resolve,reject)=>{
    bcrypt.compare(plainPassword, userData.password,(err,isMatch)=>{
      if(err) reject(err);
      resolve(isMatch)
    })
  })
}

/**
 * @desc   Generate user token
 * @return {Object} userWithToken
 */
userSchema.methods.generateToken = function(){
  return new Promise(async (resolve,reject)=>{
    let userData = this;
    let token = jwt.sign(userData._id.toHexString(), process.env.SECRET_KEY);
    userData.token = token;

    try {
      let user = await userData.save();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  })
}

/**
 * @desc   Verify user
 * @param  {String} token
 * @return {Object} user
 */
userSchema.statics.findBytoken = function(token){
  return new Promise(async (resolve,reject)=>{
    let userData = this;

    if(!token) return reject('Unauthorized');

    let dataDecoded = jwt.verify(token, process.env.SECRET_KEY);
    
    try {
      let user = await userData.findOne({
        '_id': dataDecoded,
        token
      });
      resolve(user);
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * @desc   Generate token for reset password
 * @return {Object} user
 */
userSchema.methods.generateResetToken = function() {
  return new Promise(async (resolve,reject)=>{
    let userData = this;
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');
    const today = moment().startOf('day').valueOf();
    const tomorrow = moment(today).endOf('day').valueOf();

    userData.token_reset = token;
    userData.token_reset_exp = tomorrow;

    try {
      let user = await userData.save();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  })
}


const User = model('User', userSchema);

export {
  User
};
