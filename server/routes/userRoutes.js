import express from 'express';
const router = express.Router();
import {registerUser,loginUser,verifyUser,logout,deleteAccount,forgetPassword,resetPassword,profileInfo,updateProfile} from '../controllers/userController.js'
import protect from '../middleware/protect.js';
import multer from 'multer';

// create storage 
const storage = multer.diskStorage({
  destination: (req,profilePhoto,cb)=>{
    return cb(null,'./uploads')
  },
  filename: (req,profilePhoto,cb)=>{
    return cb(null,profilePhoto.originalname)
  }
})

const upload = multer({storage});
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/verifyUser',verifyUser);
router.get('/logout',protect,logout);
router.get('/deleteAccount',protect,deleteAccount);
router.post('/forget-password',protect,forgetPassword);
router.post('/reset-password',protect,resetPassword);
router.get('/profile',protect,profileInfo);
router.patch('/updateProfile',protect,upload.single("profilePhoto"),updateProfile);

export default router;