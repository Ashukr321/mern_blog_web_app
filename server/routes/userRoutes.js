import express from 'express';
const router = express.Router();
import {registerUser,loginUser,verifyUser} from '../controllers/userController.js'
// register
router.post('/register',registerUser);
// login
router.post('/login',loginUser);
router.post('/verifyUser',verifyUser);

export default router;