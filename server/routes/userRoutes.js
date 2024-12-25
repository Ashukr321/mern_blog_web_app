import express from 'express';
const router = express.Router();
import {registerUser,loginUser} from '../controllers/userController.js'
// register
router.post('/register',registerUser);
// login
router.post('/login',loginUser);
export default router;