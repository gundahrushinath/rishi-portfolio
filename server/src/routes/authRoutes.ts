import express from 'express';
import { 
  signup, 
  signin, 
  signout, 
  verifyToken, 
  verifyEmail, 
  resendVerification,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  deleteAccount
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
router.put('/update-password', authMiddleware, updatePassword);
router.put('/update-profile', authMiddleware, updateProfile);
router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
