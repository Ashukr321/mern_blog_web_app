import User from "../models/userModel.js";
import { welcomeMailOptions, otpMailOptions, accountDeleteMailOptions, forgetPasswordMailOptions } from '../utils/mailOptions.js'
import transporter from "../utils/mailTransport.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// create user 
const registerUser = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const userName = reqBody.userName;
    const email = reqBody.email;
    const password = reqBody.password;
    const role = reqBody.role;

    //  check if user name, email, password and role is given or not
    if (!userName) {
      throw new Error("User name is required");
    }
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    

    // check if user name already exist or not
    const useExist = await User.findOne({ email: email });
    if (useExist) {
      const err = new Error();
      err.status = 401;
      err.message = "User already exist";
      return next(err);
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(password, 10);
    // create token 
    const token = jwt.sign({ email }, envConfig.jwt_secret, { expiresIn: envConfig.jwt_expires });
    // create user 
    const user = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
      role: role
    })

    await transporter.sendMail(welcomeMailOptions(email, userName));
    //  save user 
    await user.save();
    // send welcome mail 

    res.status(200).json({
      success: true,
      message: "User created successfully",
      token
    })

  } catch (error) {
    return next(error);
  }
}

// login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check email and password is given or not 
    if (!email) {
      const err = new Error();
      err.status = 401;
      err.message = "Email is required";
      return next(err);
    }
    if (!password) {
      const err = new Error();
      err.status = 401;
      err.message = "Password is required";
      return next(err);
    }

    // check userExists or not 
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = "User not found , SingUp first !";
      return next(err);
    }

    //  generate otp 
    const otpCode = generateOTP();
    // save Otp to userCollections 
    user.otp = otpCode;
    // 10 min timeout
    user.otpExpire = Date.now() + 1000 * 60 * 5;
    // send otp to user email
    await transporter.sendMail(otpMailOptions(email, otpCode));
    // save user
    await user.save();
    // Sign Token 
    const token = jwt.sign({ userId: user._id }, envConfig.jwt_secret, { expiresIn: envConfig.jwt_expires });

    // send response
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token
    })

  } catch (error) {
    return next(error);
  }
}

// verifyUser 
const verifyUser = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    // check user exist or not
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
      return next(err);
    }
    // verify Otp 
    if (user.otp !== otp) {
      const err = new Error();
      err.status = 401;
      err.message = "Invalid OTP";
      return next(err);
    }
    // check otp expire or not
    if (user.otpExpire < Date.now()) {
      const err = new Error();
      err.status = 401;
      err.message = "OTP expired";
      return next(err);
    }
    // reset otp and otp expire
    user.otp = null;
    user.otpExpire = null;
    // we have to make false when logout
    user.verified = true;
    // save user
    await user.save();

    // send response
    res.status(200).json({
      success: true,
      message: "User verified successfully,Now you can login",
    })

  } catch (error) {
    return next(error);
  }
}

// logout 
const logout = async (req, res, next) => {
  try {

    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
      return next(err);
    }
    // make verified false
    user.verified = false;
    res.clearCookie('token');
    await user.save();
    res.status(200).json({
      success: true,
      message: "User logout successfully",
    })
  } catch (error) {
    return next(error);
  }
}
// deleteAccount 
const deleteAccount = async (req, res, next) => {
  try {

    // get user 
    const user = await User.findById(req.userId);
    // check user exist or not
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
      return next(err);
    }
    // send mail
    await transporter.sendMail(accountDeleteMailOptions(user.email));
    // delete user 
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    return next(error);
  }
}

// forget password 
const forgetPassword = async (req, res, next) => {
  // token 
  // token sent to email
  try {
    // get email 
    const { email } = req.body;
    // check user exist or not
    const user = await User.findOne({ email });
    // check user Exits or not 
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
      return next(err);
    }
    // generate resetToken 
    const resetToken = await user.createPasswordToken();
    // url 
    const resetUrl = `${envConfig.client_url}/reset-password/${resetToken}`;
    // send mail
    await transporter.sendMail(forgetPasswordMailOptions(email, resetUrl));

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    })

  } catch (error) {
    return next(error);
  }

}

// reset password 
const resetPassword = async (req, res, next) => {
  try {
    // get token 
    const { token } = req.params;
    // get password 
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      const err = new Error();
      err.status = 401;
      err.message = "Password and confirm password not matched";
      return next(err);
    }
    // check token valid or not
    const hashedToken = crypto.createHash('sha256').update(toString(token)).digest('hex');

    // find user
    const user = await User.findById(req.userId);
    // check user exist or not
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = "User not found ";
      return next(err);
    }

    if (user.passwordResetToken !== hashedToken) {
      const err = new Error();
      err.status = 401;
      err.message = "Invalid token";
      return next(err);
    }

    // check token expire or not
    if (user.passwordResetTokenExpire < Date.now()) {
      const err = new Error();
      err.status = 401;
      err.message = "Token expired , Resend the Reset Link";
      return next(err);
    }

    //hashed password 
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpire = null;
    // save user
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    })

  } catch (error) {
    return next(error);
  }

}

// profileInfo 
const profileInfo = async(req,res,next)=>{
  try {

   
    const user = await User.findById(req.userId);
    if(!user){
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
      return next(err);
    }
   

     const userProfile = {
      name: user.name,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      bio:user.bio,
      profilePhoto: user.profilePhoto,
      location: user.location,
      socialLinks:user.socialLinks,
      
     }
    res.status(200).json({
      success: true,
      userProfile
    })
  } catch (error) {
    return next(error);
  }
}


//  update profile
const updateProfile =async(req,res,next)=>{
  try {
    const {userName,firstName,lastName,bio,location,socialLinks} = req.body;
    const user = await User.findById(req.userId);
    
    if(!user){
      const err = new Error();
      err.status = 401;
      err.message = "User not found";
    }
    if(userName){
      user.userName = userName;
    }
    if(firstName){
      user.firstName = firstName;
    }
    if(lastName){
      user.lastName = lastName
    }
    if(bio){
      user.bio = bio;
    }
    if(location){
      user.location = location;
    }
    if(socialLinks){
      user.socialLinks = socialLinks;
    }
    cloudinary.config({
      cloud_name: envConfig.cloudinary_cloud_name,
      api_key: envConfig.cloudinary_api_key,
      api_secret: envConfig.cloudinary_api_secret,
    });

    const result = await cloudinary.uploader.upload(req.file.path,{
      folder:"blog_user_profile"
    });
    fs.unlinkSync(req.file.path);
    user.profilePhoto = result.secure_url;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return next(error)
  }
}








//  generate top 6 dig   t 
const generateOTP = (length = 6) => {
  const min = 100000;
  const max = 999999;
  const code = Math.floor(Math.random() * (max - min + 1) + min);
  return code.toString();
}

export { registerUser, loginUser, verifyUser, logout, deleteAccount, forgetPassword,resetPassword,profileInfo,updateProfile }