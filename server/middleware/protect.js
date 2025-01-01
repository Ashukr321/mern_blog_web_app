import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import envConfig from '../config/envConfig.js';

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Use optional chaining to avoid errors if authorization is undefined
    if (!token) {
      const err = new Error("Token is required");
      err.status = 401;
      return next(err);
    }

    // Decode the token
    const decoded = jwt.verify(token, envConfig.jwt_secret);
    const id = decoded.userId; // No need to use await here, as decoded is already the result
    req.userId = id;

    // Find the user by ID
    const user = await User.findById(req.userId);

    if (!user) {
      const err = new Error("User  not found");
      err.status = 401;
      return next(err); // Call next with the error
    }

    // Check if the user is verified
    if (!user.verified) {
      const err = new Error("User  not verified");
      err.status = 401;
      return next(err); // Call next with the error
    }

    // If everything is fine, proceed to the next middleware
    return next();
  } catch (error) {
    return next(error); // Pass any other errors to the error handler
  }
};

export default protect;