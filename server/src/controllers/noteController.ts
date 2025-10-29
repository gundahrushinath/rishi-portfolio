import { Request, Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middleware/auth';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { category, isPinned, isArchived, search, tags } = req.query;
    
    const filter: any = { userId };
    
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
    if (tags) {
      const tagArray = (tags as string).split(',');
      filter.tags = { $in: tagArray };
    }
    if (search) {
      filter.$text = { $search: search as string };
    }

    const notes = await Note.find(filter)
      .sort({ isPinned: -1, updatedAt: -1 })
      .populate('collaborators', 'name email')
      .lean();

    res.status(200).json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content, category, tags, color, isPinned, reminder, attachments } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Note title is required' });
    }

    const newNote = new Note({
      userId,
      title: title.trim(),
      content: content || '',
      category: category || 'Personal',
      tags: Array.isArray(tags) ? tags : [],
      color: color || '#ffffff',
      isPinned: isPinned || false,
      isArchived: false,
      reminder: reminder || null,
      attachments: attachments || [],
      lastModifiedBy: userId,
    });

    await newNote.save();

    res.status(201).json({
      message: 'Note created successfully',
      note: newNote,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, content, category, tags, color, isPinned, isArchived, reminder, attachments } = req.body;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (tags !== undefined) note.tags = Array.isArray(tags) ? tags : [];
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;
    if (reminder !== undefined) note.reminder = reminder;
    if (attachments !== undefined) note.attachments = attachments;
    note.lastModifiedBy = userId as any;

    await note.save();

    res.status(200).json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await Note.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const note = await Note.findOne({ _id: id, userId })
      .populate('collaborators', 'name email');

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

export const duplicateNote = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const originalNote = await Note.findOne({ _id: id, userId });

    if (!originalNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const duplicatedNote = new Note({
      userId,
      title: `${originalNote.title} (Copy)`,
      content: originalNote.content,
      category: originalNote.category,
      tags: originalNote.tags,
      color: originalNote.color,
      isPinned: false,
      isArchived: false,
      attachments: originalNote.attachments,
      lastModifiedBy: userId,
    });

    await duplicatedNote.save();

    res.status(201).json({
      message: 'Note duplicated successfully',
      note: duplicatedNote,
    });
  } catch (error) {
    console.error('Error duplicating note:', error);
    res.status(500).json({ error: 'Failed to duplicate note' });
  }
};
