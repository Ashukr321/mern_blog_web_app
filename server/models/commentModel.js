// import mongoose and  User And Blog 
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Blog from '../models/blogModel.js'

// create Comment Schema 
const CommentSchema = new mongoose.Schema({
  comment:{
    type:String,
    required:true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  blog:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Blog',
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
},{
  timestamps:true
})
const Comments = mongoose.model('Comments',CommentSchema);
// export Comment Model
export default Comments;