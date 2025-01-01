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



/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user with a file upload
 *     description: This endpoint allows for user registration along with a file upload.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: String 
 *         name: userName
 *         type: string
 *         required: true
 *         description: This is the userName.
 *       - in: String
 *         name: email
 *         type: string
 *         required: true
 *         description: This is the email
 * 
 *       - in: String
 *         name: password
 *         type: string
 *         required: true
 *         description: This is the password
 *       - in: String
 *         name: role
 *         type: string
 *         required: true  
 *         description: This is the role of the user default role is user
 * 
 *         
 *     responses:
 *       200: 
 *        description: User created successfully
 *      
 *        content: 
 *       400:
 *        description:
 */

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