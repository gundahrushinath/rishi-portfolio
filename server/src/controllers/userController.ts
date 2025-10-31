import { Request, Response } from 'express';
import User from '../models/User';
import { UserRole } from '../types/rbac';
import { AuthRequest } from '../middleware/auth';
import { getCurrentRolePermissions } from './roleController';

/**
 * Get current user profile with role information
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user?.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get dynamic permissions for the user's role
    const rolePermissions = getCurrentRolePermissions();
    const userPermissions = rolePermissions[user.role] || [];
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: userPermissions,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    
    // Get dynamic permissions
    const rolePermissions = getCurrentRolePermissions();
    
    res.json({
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: rolePermissions[user.role] || [],
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get dynamic permissions for the user's role
    const rolePermissions = getCurrentRolePermissions();
    const userPermissions = rolePermissions[user.role] || [];
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: userPermissions,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user statistics (Admin only)
 */
export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: UserRole.ADMIN });
    const userCount = await User.countDocuments({ role: UserRole.USER });
    const guestCount = await User.countDocuments({ role: UserRole.GUEST });
    const verifiedCount = await User.countDocuments({ emailVerified: true });
    
    res.json({
      statistics: {
        total: totalUsers,
        byRole: {
          admin: adminCount,
          user: userCount,
          guest: guestCount
        },
        verified: verifiedCount,
        unverified: totalUsers - verifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
