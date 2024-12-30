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
// 

export {createBlog}
