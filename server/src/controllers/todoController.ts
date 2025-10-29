import { Request, Response } from 'express';
import Todo from '../models/Todo';
import { AuthRequest } from '../middleware/auth';

export const getTodos = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, priority, category, dueDateStart, dueDateEnd, search } = req.query;
    
    const filter: any = { userId };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (dueDateStart || dueDateEnd) {
      filter.dueDate = {};
      if (dueDateStart) filter.dueDate.$gte = new Date(dueDateStart as string);
      if (dueDateEnd) filter.dueDate.$lte = new Date(dueDateEnd as string);
    }
    if (search) {
      filter.$text = { $search: search as string };
    }

    const todos = await Todo.find(filter)
      .sort({ priority: 1, dueDate: 1, createdAt: -1 })
      .populate('dependencies', 'title status')
      .lean();

    res.status(200).json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, priority, status, category, dueDate, tags, subtasks, estimatedTime, recurring, reminder, notes, dependencies } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Todo title is required' });
    }

    const newTodo = new Todo({
      userId,
      title: title.trim(),
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Todo',
      category: category || 'Personal',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      estimatedTime: estimatedTime || null,
      recurring: recurring || { enabled: false },
      reminder: reminder || null,
      notes: notes || '',
      dependencies: Array.isArray(dependencies) ? dependencies : [],
    });

    await newTodo.save();

    res.status(201).json({
      message: 'Todo created successfully',
      todo: newTodo,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, description, priority, status, category, dueDate, tags, subtasks, estimatedTime, actualTime, recurring, reminder, notes, dependencies } = req.body;

    const todo = await Todo.findOne({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description;
    if (priority !== undefined) todo.priority = priority;
    if (status !== undefined) {
      todo.status = status;
      if (status === 'Completed' && !todo.completedAt) {
        todo.completedAt = new Date();
      } else if (status !== 'Completed') {
        todo.completedAt = null as any;
      }
    }
    if (category !== undefined) todo.category = category;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (tags !== undefined) todo.tags = Array.isArray(tags) ? tags : [];
    if (subtasks !== undefined) todo.subtasks = Array.isArray(subtasks) ? subtasks : [];
    if (estimatedTime !== undefined) todo.estimatedTime = estimatedTime;
    if (actualTime !== undefined) todo.actualTime = actualTime;
    if (recurring !== undefined) todo.recurring = recurring;
    if (reminder !== undefined) todo.reminder = reminder;
    if (notes !== undefined) todo.notes = notes;
    if (dependencies !== undefined) todo.dependencies = Array.isArray(dependencies) ? dependencies : [];

    await todo.save();

    res.status(200).json({
      message: 'Todo updated successfully',
      todo,
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await Todo.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, userId })
      .populate('dependencies', 'title status');

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

export const updateSubtask = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id, subtaskId } = req.params;
    const { completed } = req.body;

    const todo = await Todo.findOne({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Find the subtask by its _id
    const subtaskDoc = (todo.subtasks as any).id(subtaskId);
    if (!subtaskDoc) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    subtaskDoc.completed = completed;
    if (completed) {
      subtaskDoc.completedAt = new Date();
    } else {
      subtaskDoc.completedAt = undefined;
    }

    await todo.save();

    res.status(200).json({
      message: 'Subtask updated successfully',
      todo,
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ error: 'Failed to update subtask' });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const totalTodos = await Todo.countDocuments({ userId });
    const completedTodos = await Todo.countDocuments({ userId, status: 'Completed' });
    const inProgressTodos = await Todo.countDocuments({ userId, status: 'In Progress' });
    const overdueTodos = await Todo.countDocuments({
      userId,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() },
    });

    const priorityStats = await Todo.aggregate([
      { $match: { userId: userId as any } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const categoryStats = await Todo.aggregate([
      { $match: { userId: userId as any } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalTodos,
      completedTodos,
      inProgressTodos,
      overdueTodos,
      priorityStats,
      categoryStats,
      completionRate: totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
