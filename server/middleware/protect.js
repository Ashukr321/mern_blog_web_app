import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';
import envConfig from '../config/envConfig.js';
const protect = async(req,res,next)=>{
  try {
    const token = await req.headers.authorization.split(" ")[1];
    if(!token){
      const err = new Error();
      err.status = 401;
      err.message = "Token is required";
      return next(err);
    }
    // decoded 
    const decoded = jwt.verify(token,envConfig.jwt_secret);
    req.userId =await decoded.userId;

    const user = await User.findById(req.userId);
   

    if(!user){
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
    }
    // console.log(user.verified)
    // check verified or not 
    if(!user.verified){
      const err = new Error();
      err.status = 401;
      err.message = "User not verified";
      return next(err);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
export default protect;