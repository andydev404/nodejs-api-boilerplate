import { User } from '../modules/user/user.model';

// Check if is the correct user
const authenticationRequired = async (req,res,next) => {
  let token = req.cookies.auth_token;
  try {
    let user = await User.findBytoken(token);
    if(!user) return res.status(401).json({isAuth:false});
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(error);
  }
}

export {
  authenticationRequired
}