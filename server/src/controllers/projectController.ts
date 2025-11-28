import { Request, Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract query parameters
    const {
      status,
      priority,
      search,
      tags,
      isFeatured,
      isArchived,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '100',
    } = req.query;

    // Build filter object
    const filter: any = { userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim());
      filter.tags = { $in: tagArray };
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj: any = { [sortBy as string]: sortOrder };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [projects, totalCount] = await Promise.all([
      Project.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Project.countDocuments(filter),
    ]);

    res.status(200).json({
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      status,
      priority,
      tags,
      dueDate,
      startDate,
      link,
      githubUrl,
      liveUrl,
      technologies,
      progress,
      notes,
      isFeatured,
      isArchived,
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
    }

    if (description && description.length > 2000) {
      return res.status(400).json({ error: 'Description cannot exceed 2000 characters' });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    const newProject = new Project({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'Active',
      priority: priority || 'Medium',
      tags: Array.isArray(tags) ? tags.filter(t => t.trim()).map(t => t.trim()) : [],
      dueDate: dueDate || null,
      startDate: startDate || null,
      link: link?.trim() || '',
      githubUrl: githubUrl?.trim() || '',
      liveUrl: liveUrl?.trim() || '',
      technologies: Array.isArray(technologies) ? technologies.filter(t => t.trim()).map(t => t.trim()) : [],
      progress: progress !== undefined ? progress : 0,
      notes: notes?.trim() || '',
      isFeatured: isFeatured || false,
      isArchived: isArchived || false,
    });

    await newProject.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const {
      title,
      description,
      status,
      priority,
      tags,
      dueDate,
      startDate,
      link,
      githubUrl,
      liveUrl,
      technologies,
      progress,
      notes,
      isFeatured,
      isArchived,
    } = req.body;

    // Validation
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ error: 'Project title cannot be empty' });
    }

    if (title && title.trim().length > 200) {
      return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
    }

    if (description && description.length > 2000) {
      return res.status(400).json({ error: 'Description cannot exceed 2000 characters' });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update fields
    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;
    if (tags !== undefined) project.tags = Array.isArray(tags) ? tags.filter(t => t.trim()).map(t => t.trim()) : [];
    if (dueDate !== undefined) project.dueDate = dueDate || null;
    if (startDate !== undefined) project.startDate = startDate || null;
    if (link !== undefined) project.link = link?.trim() || '';
    if (githubUrl !== undefined) project.githubUrl = githubUrl?.trim() || '';
    if (liveUrl !== undefined) project.liveUrl = liveUrl?.trim() || '';
    if (technologies !== undefined) project.technologies = Array.isArray(technologies) ? technologies.filter(t => t.trim()).map(t => t.trim()) : [];
    if (progress !== undefined) project.progress = progress;
    if (notes !== undefined) project.notes = notes?.trim() || '';
    if (isFeatured !== undefined) project.isFeatured = isFeatured;
    if (isArchived !== undefined) project.isArchived = isArchived;

    await project.save();

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const result = await Project.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await Project.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } },
          ],
          overall: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                avgProgress: { $avg: '$progress' },
                featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
                archived: { $sum: { $cond: ['$isArchived', 1, 0] } },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json({ stats: stats[0] });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
};

export const bulkUpdateProjects = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { projectIds, updates } = req.body;

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'Project IDs array is required' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Updates object is required' });
    }

    // Validate all IDs
    for (const id of projectIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `Invalid project ID: ${id}` });
      }
    }

    const result = await Project.updateMany(
      { _id: { $in: projectIds }, userId },
      { $set: updates }
    );

    res.status(200).json({
      message: 'Projects updated successfully',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error bulk updating projects:', error);
    res.status(500).json({ error: 'Failed to bulk update projects' });
  }
};

export const bulkDeleteProjects = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { projectIds } = req.body;

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'Project IDs array is required' });
    }

    // Validate all IDs
    for (const id of projectIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `Invalid project ID: ${id}` });
      }
    }

    const result = await Project.deleteMany({
      _id: { $in: projectIds },
      userId,
    });

    res.status(200).json({
      message: 'Projects deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error bulk deleting projects:', error);
    res.status(500).json({ error: 'Failed to bulk delete projects' });
  }
};
