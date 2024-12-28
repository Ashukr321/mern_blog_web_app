import express from 'express';
const router = express.Router();
import {registerUser,loginUser,verifyUser,logout,deleteAccount,forgetPassword,resetPassword,profileInfo} from '../controllers/userController.js'
import protect from '../middleware/protect.js';


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/verifyUser',verifyUser);
router.get('/logout',protect,logout);
router.get('/deleteAccount',protect,deleteAccount);
router.post('/forget-password',protect,forgetPassword);
router.post('/reset-password',protect,resetPassword);
router.get('/profile',protect,profileInfo);
export default router;