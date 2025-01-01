import Blog from '../models/blogModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import envConfig from '../config/envConfig.js';

// create blog 1
const createBlog = async(req,res)=>{
  try{
    const {title,content} = req.body;
    // config cloudinary
    cloudinary.config({
      cloud_name: envConfig.cloudinary_cloud_name,
      api_key: envConfig.cloudinary_api_key,
      api_secret: envConfig.cloudinary_api_secret,
    });
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder:"blogPhotos"
    });

    fs.unlinkSync(req.file.path);

    const blog = await Blog.create({
      title,
      content,
      blogPhoto: result.secure_url,
      author: req.userId
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
    })
  }catch(error){
    console.log(error);
  }
};

// 2 getAllBlogs
const getAllBlogs = async (req,res,next)=>{
  try{
    // find all blogs check blog present or not 
    const blogs = await Blog.find();
    if(blogs.length === 0){
      const err  = new Error();
      err.message = "No blog found";
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({
      total:blogs.length,
      success: true,
      blogs
    })
    // send blog 
  }catch(error){
    return next(error);
  }
}


// 3. getBlogById 
const getBlogById = async (req,res,next)=>{
  try {
    const blogId =  req.params.id;
    // find blog by id 
    const blog = await Blog.findById({_id:blogId});
    // check blog present or not
    if(!blog){
      const err = new Error();
      err.status = 404;
      err.message = "Blog not found";
      return next(err);
    }
    // send blog
    res.status(200).json({
      blog
    })
  } catch (error) {
    return next(error);
  }
}


// Admin task 
// 4. updateBlog (blogPhoto, title, content)
const updateBlog = async (req, res, next) => {
  try {
    // Extract the blog ID from the request parameters
    const blogId = req.params.id;
   
    // Find the blog by its ID
    const blog = await Blog.findById({ _id: blogId });

    

    // Check if the blog exists; if not, return a 404 error
    if (!blog) {
      const err = new Error("Blog not found");
      err.status = 404;
      return next(err);
    }
    
   // Convert req.userId to ObjectId for comparison
    const userIdObjectId = new ObjectId(req.userId);
    // Check if the user is the author of the blog

    if (!blog.author.equals(userIdObjectId)) {
      const err = new Error("You are not authorized to update this blog");
      err.status = 403;
      return next(err);
  }

    // Configure Cloudinary for image uploads
    cloudinary.config({
      cloud_name: envConfig.cloudinary_cloud_name,
      api_key: envConfig.cloudinary_api_key,
      api_secret: envConfig.cloudinary_api_secret,
    });

    // Determine if a new photo has been uploaded
    const isPhotoUpdated = req.file ? true : false;
    let result;

    // If a new photo is uploaded, handle the upload to Cloudinary
    if (isPhotoUpdated) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogPhotos"
      });
      // Clean up the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }
    
    // Extract updated data from the request body
    const { title, content } = req.body;
    console.log(`New title: ${title}, New content: ${content}`);

    // Update the blog's properties with new data
    blog.title = title;
    blog.content = content;
    // Update the blog photo URL if a new photo was uploaded
    blog.blogPhoto = isPhotoUpdated ? result.secure_url : blog.blogPhoto;

    // Save the updated blog document to the database
    await blog.save();
    
    // Send a success response back to the client
    res.status(200).json({
      success: true,
      message: "Blog updated successfully"
    });
    
  } catch (error) {
    // Pass any errors to the error handling middleware
    return next(error);
  }
}



// 5 Admin get their created blog 
const getAdminBlog = async (req, res, next) => {
  try {
    
    const blogs = await Blog.find({ author: req.userId });
   
    if(!blog.length==0) {
      const err = new Error();
      err.message = "No blog found";
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      total:blogs.length,
      success: true,
      blogs
    });

  } catch (error) {
    return next(error);
  }
};


// 6 delete the blog (Admin only do this )
const deleteBlogById= async (req,res,next)=>{
  try{
    // get blog id 
    const blogId = req.params.id;
    // find blog by blogId 
    const blog = await Blog.findById({_id:blogId});
    // check blog is present or not 
    if (!blog){
      const err = new Error();
      err.message = "Blog not found";
      err.statusCode = 404;
      return next(err);
    }

    // check authorized user is author of blog or not
    if(blog.author.toString() !== req.userId.toString()){
      const err = new Error();
      err.message = "You are not authorized to delete this blog";
      err.statusCode = 403;
      return next(err);
    }

    // delete blog
    await Blog.deleteOne({_id:blogId});
    // send success response
    res.status(200).json({
      success:true,
      message:"Blog deleted successfully"
    })
  
  }catch(error){
    return next(error);
  }
}

// deleteBlogs (Admin only do this )
const deleteBlogs = async(req,res,next)=>{
  try{
    // find all blogs of admin and delete them
    const blogList = await  Blog.find({author:req.userId});
    // check blog is present or not
    if(blogList.length==0){
      const err = new Error();
      err.message = "No blog found";
      err.statusCode = 404;
      return next(err);
    }
    // delete all blogs
    await Blog.deleteMany({author:req.userId});
    // send success response
    res.status(200).json({
      success:true,
      message:"Blog deleted successfully"
    })

  }catch(error){
    return next(error);
  }
}


export {createBlog,getAllBlogs,getBlogById,updateBlog,getAdminBlog,deleteBlogById,deleteBlogs}
