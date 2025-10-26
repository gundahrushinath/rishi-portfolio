import express from 'express';
import { signup, signin, signout, verifyToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/verify', authMiddleware, verifyToken);

export default router;
