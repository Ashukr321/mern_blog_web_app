import Blog from '../models/blogModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import envConfig from '../config/envConfig.js';


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

// getAllBlogs
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
      success: true,
      blogs
    })
    // send blog 
  }catch(error){
    return next(error);
  }
}


// getBlogById 
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


export {createBlog,getAllBlogs,getBlogById}
