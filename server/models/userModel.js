import mongoose from "mongoose";
import crypto from "crypto";
// Create userSchema for user management
const userSchema = new mongoose.Schema({
  // Basic user information
  userName: {
    type: String,
    required: [true, 'Please enter your user name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true, // Ensure email is unique
    lowercase: true, // Store email in lowercase
    trim: true, // Remove whitespace
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 6, // Minimum password length
  },

  // User role (admin or user)
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
   
  },

  // Optional user profile information
  profilePhoto: {
    type: String,
    default: null,
  },

  firstName: {
    type: String,
    default: null,
  },

  lastName: {
    type: String,
    default: null,
  },

  bio: {
    type: String,
    default: null,
  },

  location: {
    type: String,
    default: null,
  },

  // Social media links
  socialLinks: [
    {
      type: String,
      default: null,
    }
  ],

 
  // otp options
  otp: {
    type: String,
    default: null,
  },
  otpExpire: {
    type: Date,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  
  resetPasswordToken: {
    type: String,
    default: null,
  },
  // Reset password token expiration time
  resetPasswordExpire: {
    type: Date,
    default: null,
  }
  
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});



// create resetPasswordToken and 
userSchema.methods.createPasswordToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;// 10 min
  return resetToken;
}


// Create User model from the schema
const User = mongoose.model('User ', userSchema);

// Export the User model for use in other parts of the application
export default User;