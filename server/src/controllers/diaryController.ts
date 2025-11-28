import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Diary from '../models/Diary';
import { AuthRequest } from '../middleware/auth';

export const getEntries = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      search,
      mood,
      tags,
      startDate,
      endDate,
      isFavorite,
      sortBy = 'date',
      order = 'desc',
      page = '1',
      limit = '20',
    } = req.query;

    const filter: any = { userId };

    if (mood) filter.mood = mood;
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';
    
    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim());
      filter.tags = { $in: tagArray };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj: any = { [sortBy as string]: sortOrder };

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [entries, totalCount] = await Promise.all([
      Diary.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Diary.countDocuments(filter),
    ]);

    res.status(200).json({
      entries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({ error: 'Failed to fetch diary entries' });
  }
};

export const createEntry = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content, mood, tags, date, isFavorite } = req.body;

    const entry = await Diary.create({
      userId,
      title,
      content,
      mood,
      tags,
      date: date || new Date(),
      isFavorite,
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating diary entry:', error);
    res.status(500).json({ error: 'Failed to create diary entry' });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const entry = await Diary.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error('Error updating diary entry:', error);
    res.status(500).json({ error: 'Failed to update diary entry' });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const entry = await Diary.findOneAndDelete({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    res.status(200).json({ message: 'Diary entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    res.status(500).json({ error: 'Failed to delete diary entry' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const totalEntries = await Diary.countDocuments({ userId });
    
    // Get mood distribution
    const moodStats = await Diary.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
    ]);

    // Get entries this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const entriesThisMonth = await Diary.countDocuments({
      userId,
      date: { $gte: startOfMonth },
    });

    res.status(200).json({
      totalEntries,
      moodStats,
      entriesThisMonth,
    });
  } catch (error) {
    console.error('Error fetching diary stats:', error);
    res.status(500).json({ error: 'Failed to fetch diary stats' });
  }
};
