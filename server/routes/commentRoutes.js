import express from 'express';
import protect from '../middleware/protect.js';
import { createComment } from '../controllers/commentControllers.js';
const router = express.Router();

router.post('/createComment',protect, createComment);


// export comment 
export default router;