import express from 'express';
import { 
  signup, 
  signin, 
  signout, 
  verifyToken, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/verify', authMiddleware, verifyToken);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
