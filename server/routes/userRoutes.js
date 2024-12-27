import express from 'express';
const router = express.Router();
import {registerUser,loginUser,verifyUser,logout,deleteAccount,forgetPassword} from '../controllers/userController.js'
import protect from '../middleware/protect.js';


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/verifyUser',verifyUser);
router.get('/logout',protect,logout);
router.get('/deleteAccount',protect,deleteAccount);
router.post('/forget-password',protect,forgetPassword);

export default router;