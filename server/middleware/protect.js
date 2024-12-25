import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import User from '../models/userModel.js';

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      const err = new Error("Unauthorized");
      err.status = 401; // Set status code to 401 for unauthorized access
      return next(err); // Pass the error to the next middleware
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, envConfig.jwt_secret);

    // Check if the user exists in the database
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      const err = new Error("Unauthorized");
      err.status = 401; // Set status code to 401 for unauthorized access
      return next(err); // Pass the error to the next middleware
    }

    // Check if the user has verified their account
    if (!user.verified) {
      const err = new Error("Please verify your account");
      err.status = 401; // Set status code to 401 for unauthorized access
      return next(err); // Pass the error to the next middleware
    }

    // If all checks pass, proceed to the next middleware
    return next();
  } catch (error) {
    // Handle any errors that occur during the process
    return next(error); // Pass the error to the next middleware
  }
}

export default protect;