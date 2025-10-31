import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/rbac';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    
    // Fetch user to get role information
    const user = await User.findById(decoded.userId).select('role');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    (req as AuthRequest).user = { 
      id: decoded.userId,
      role: user.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
