import mongoose from "mongoose";

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

  // Followers and following relationships
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User ',
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User ',
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
  }
  
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create User model from the schema
const User = mongoose.model('User ', userSchema);

// Export the User model for use in other parts of the application
export default User;