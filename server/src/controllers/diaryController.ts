import { Request, Response } from 'express';
import Diary from '../models/Diary';
import { AuthRequest } from '../middleware/auth';

export const getDiaries = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { mood, startDate, endDate, search, tags } = req.query;
    
    const filter: any = { userId };
    
    if (mood) filter.mood = mood;
    if (tags) {
      const tagArray = (tags as string).split(',');
      filter.tags = { $in: tagArray };
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    if (search) {
      filter.$text = { $search: search as string };
    }

    const diaries = await Diary.find(filter)
      .sort({ date: -1 })
      .lean();

    res.status(200).json({ diaries });
  } catch (error) {
    console.error('Error fetching diaries:', error);
    res.status(500).json({ error: 'Failed to fetch diaries' });
  }
};

export const createDiary = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content, date, mood, weather, tags, isPrivate, location, images, gratitudeList, goals } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Diary title is required' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Diary content is required' });
    }

    const newDiary = new Diary({
      userId,
      title: title.trim(),
      content: content.trim(),
      date: date || new Date(),
      mood: mood || 'Neutral',
      weather: weather || '',
      tags: Array.isArray(tags) ? tags : [],
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      location: location || '',
      images: Array.isArray(images) ? images : [],
      gratitudeList: Array.isArray(gratitudeList) ? gratitudeList : [],
      goals: Array.isArray(goals) ? goals : [],
    });

    await newDiary.save();

    res.status(201).json({
      message: 'Diary entry created successfully',
      diary: newDiary,
    });
  } catch (error) {
    console.error('Error creating diary:', error);
    res.status(500).json({ error: 'Failed to create diary entry' });
  }
};

export const updateDiary = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, content, date, mood, weather, tags, isPrivate, location, images, gratitudeList, goals } = req.body;

    const diary = await Diary.findOne({ _id: id, userId });

    if (!diary) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    if (title !== undefined) diary.title = title.trim();
    if (content !== undefined) diary.content = content.trim();
    if (date !== undefined) diary.date = new Date(date);
    if (mood !== undefined) diary.mood = mood;
    if (weather !== undefined) diary.weather = weather;
    if (tags !== undefined) diary.tags = Array.isArray(tags) ? tags : [];
    if (isPrivate !== undefined) diary.isPrivate = isPrivate;
    if (location !== undefined) diary.location = location;
    if (images !== undefined) diary.images = Array.isArray(images) ? images : [];
    if (gratitudeList !== undefined) diary.gratitudeList = Array.isArray(gratitudeList) ? gratitudeList : [];
    if (goals !== undefined) diary.goals = Array.isArray(goals) ? goals : [];

    await diary.save();

    res.status(200).json({
      message: 'Diary entry updated successfully',
      diary,
    });
  } catch (error) {
    console.error('Error updating diary:', error);
    res.status(500).json({ error: 'Failed to update diary entry' });
  }
};

export const deleteDiary = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await Diary.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    res.status(200).json({ message: 'Diary entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting diary:', error);
    res.status(500).json({ error: 'Failed to delete diary entry' });
  }
};

export const getDiaryById = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const diary = await Diary.findOne({ _id: id, userId });

    if (!diary) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    res.status(200).json({ diary });
  } catch (error) {
    console.error('Error fetching diary:', error);
    res.status(500).json({ error: 'Failed to fetch diary entry' });
  }
};

export const getMoodStats = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const moodStats = await Diary.aggregate([
      { $match: { userId: userId as any } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ moodStats });
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    res.status(500).json({ error: 'Failed to fetch mood statistics' });
  }
};
