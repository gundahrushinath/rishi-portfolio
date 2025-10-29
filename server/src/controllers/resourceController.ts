import { Request, Response } from 'express';
import Resource from '../models/Resource';
import { AuthRequest } from '../middleware/auth';

export const getResources = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Optional query parameters for filtering
    const { category, isFeatured } = req.query;
    
    const filter: any = { userId };
    
    if (category) {
      filter.category = category;
    }
    
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, category, url, thumbnail, tags, isFeatured } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Resource title is required' });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Resource URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Please provide a valid URL' });
    }

    const newResource = new Resource({
      userId,
      title: title.trim(),
      description: description?.trim() || 'No description provided',
      category: category || 'Other',
      url: url.trim(),
      thumbnail: thumbnail?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: isFeatured || false,
    });

    await newResource.save();

    res.status(201).json({
      message: 'Resource created successfully',
      resource: newResource,
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, description, category, url, thumbnail, tags, isFeatured } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Resource title is required' });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Resource URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Please provide a valid URL' });
    }

    const resource = await Resource.findOne({ _id: id, userId });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resource.title = title.trim();
    resource.description = description?.trim() || 'No description provided';
    resource.category = category || 'Other';
    resource.url = url.trim();
    resource.thumbnail = thumbnail?.trim() || '';
    resource.tags = Array.isArray(tags) ? tags : [];
    resource.isFeatured = isFeatured || false;

    await resource.save();

    res.status(200).json({
      message: 'Resource updated successfully',
      resource,
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await Resource.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const resource = await Resource.findOne({ _id: id, userId });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json({ resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};
