import Comments from '../models/commentModel.js';
import Blog from '../models/blogModel.js';
// create comment 
const createComment = async(req,res,next)=>{
  try {
    // get userID 
    const userId = req.userId;
    // get blogID  from header
    const blogId = await req.headers.blog_id;
    // check blog exists or not 
    const blog = await Blog.findById(blogId);
    if(!blog){
      return next(new Error(404,"Blog not found"));
    }

    // get comment from req.body
    const {comment} = req.body;
    if(comment.length== 0){
      return next(new Error("Please provide comment"));
    }
    // create comment  add ref of user and blog 
    const commentObj = new Comments({
      comment,
      user:userId,
      blog:blogId
    });

    // save comment 
    await commentObj.save();
    res.json({
      status:"success",
      message:"comment created successfully"
    })

  } catch (error) {
    return next(error);
  }
}
// export comment controllers
export {createComment}