// import package 
import mongoose from "mongoose";
// create blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  blogPhoto: {
    type: String,
  },
  // reference to the user who created the blog
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
}, {
  timestamps: true,

});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;