import User  from "../models/userModel.js";
import {welcomeMailOptions} from '../utils/mailOptions.js'
import transporter from "../utils/mailTransport.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
// create user 
const registerUser = async(req,res,next)=>{
  try{
    const reqBody = req.body;
    const userName = reqBody.userName;
    const email = reqBody.email;
    const password = reqBody.password;
    const role = reqBody.role;

    //  check if user name, email, password and role is given or not
    if(!userName){
      throw new Error("User name is required");
    }
    if(!email){
      throw new Error("Email is required");
    }
    if(!password){
      throw new Error("Password is required");
    }
   
    // check if user name already exist or not
    const useExist = await User.findOne({email: email});
    if(useExist){
      throw new Error("User name already exist");
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(password,10);
    // create token 
    const token = jwt.sign({email},envConfig.jwt_secret,{expiresIn:envConfig.jwt_expires});
    // create user 
    const user   = new User({
      userName:userName,
      email:email,
      password:hashedPassword,
      role:role
    })

    await transporter.sendMail(welcomeMailOptions(email,userName));
    //  save user 
    await user.save();
    // send welcome mail 

    res.status(200).json({
      success:true,
      message:"User created successfully",
      token
    })

  }catch(error){
   return next(error);
  }
}
export {registerUser}