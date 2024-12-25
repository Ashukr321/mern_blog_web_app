import express from 'express';
const router = express.Router();
import {registerUser,loginUser,verifyUser,logout,deleteAccount} from '../controllers/userController.js'
import protect from '../middleware/protect.js';
// register
router.post('/register',registerUser);
// login
router.post('/login',loginUser);
router.post('/verifyUser',verifyUser);
router.get('/logout',protect,logout);
router.get('/deleteAccount',protect,deleteAccount);


export default router;