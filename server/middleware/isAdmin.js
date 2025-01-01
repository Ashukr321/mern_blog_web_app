import User from "../models/userModel.js";
const isAdmin = async(req,res,next)=>{
  const user = await User.findById(req.userId);
  if(user.role!="admin"){
    const err = new Error();
    err.status = 403;
    err.message = "You are not authorized to access this route";
    return next(err);
  }
 return next();
}

export default isAdmin;