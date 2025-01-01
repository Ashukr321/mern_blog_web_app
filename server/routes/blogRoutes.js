import express from 'express';
const router = express.Router();
import multer from 'multer';

 import { createBlog,getAllBlogs,getBlogById,updateBlog ,getAdminBlog,deleteBlogById,deleteBlogs,likeBlog} from '../controllers/blogControllers.js';
import protect from '../middleware/protect.js';
import isAdmin from '../middleware/isAdmin.js';

const storage = multer.diskStorage({
  destination: (req,blogPhoto,cb)=>{
    return cb(null,'./uploads');
  },
  filename:(req,blogPhoto,cb)=>{
    return cb(null,blogPhoto.originalname);
  }
})


const upload = multer({storage:storage});

router.post('/createBlog',protect,isAdmin,upload.single("blogPhoto"),createBlog);
router.get('/getAdminBlogs',protect,isAdmin,getAdminBlog)

router.get('/getAllBlogs',getAllBlogs);
router.get('/:id',getBlogById);

router.put('/likeBlog/:id',protect,likeBlog);

router.put('/update/:id',protect,isAdmin,upload.single("blogPhoto"),updateBlog);

// delete blog by admin 
router.delete('/deleteBlog/:id',protect,isAdmin,deleteBlogById);
router.delete('/deleteBlogs',protect,isAdmin,deleteBlogs);


export default router