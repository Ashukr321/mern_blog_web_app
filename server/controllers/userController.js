import User from "../models/userModel.js";
import { welcomeMailOptions,otpMailOptions } from '../utils/mailOptions.js'
import transporter from "../utils/mailTransport.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
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
    const otpCode =  generateOTP();
    // save Otp to userCollections 
    user.otp = otpCode;
    // 10 min timeout
    user.otpExpire= Date.now() + 1000 * 60 * 5;
    // send otp to user email
    await transporter.sendMail(otpMailOptions(email, otpCode));
    // save user
    await user.save();
    // Sign Token 
    const token = jwt.sign({ userId : user._id }, envConfig.jwt_secret, { expiresIn: envConfig.jwt_expires });

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


//  generate top 6 digit 
const generateOTP = (length = 6) => {
  const min = 100000;
  const max = 999999;
  const code = Math.floor(Math.random() * (max - min + 1) + min);
  return code.toString();
}

export { registerUser,loginUser }