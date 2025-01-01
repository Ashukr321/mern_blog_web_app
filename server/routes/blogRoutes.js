import express from 'express';
const router = express.Router();
import multer from 'multer';

 import { createBlog,getAllBlogs,getBlogById } from '../controllers/blogControllers.js';
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
router.get('/getAllBlogs',getAllBlogs);
router.get('/:id',getBlogById);


export default router