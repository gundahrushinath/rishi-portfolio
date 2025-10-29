import { Request, Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const projects = await Project.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ projects });
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

    const { title, description, status, tags, dueDate, link } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const newProject = new Project({
      userId,
      title: title.trim(),
      description: description?.trim() || 'No description provided',
      status: status || 'Active',
      tags: Array.isArray(tags) ? tags : [],
      dueDate: dueDate || null,
      link: link?.trim() || '',
    });

    await newProject.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
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
    const { title, description, status, tags, dueDate, link } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.title = title.trim();
    project.description = description?.trim() || 'No description provided';
    project.status = status || 'Active';
    project.tags = Array.isArray(tags) ? tags : [];
    project.dueDate = dueDate || null;
    project.link = link?.trim() || '';

    await project.save();

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error('Error updating project:', error);
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
