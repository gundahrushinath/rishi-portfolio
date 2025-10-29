import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'Active' | 'In Progress' | 'Completed';
  tags: string[];
  dueDate?: Date;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: 'No description provided',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Active', 'In Progress', 'Completed'],
      default: 'Active',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    dueDate: {
      type: Date,
      default: null,
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
