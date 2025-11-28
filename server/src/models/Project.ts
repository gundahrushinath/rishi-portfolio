import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'Active' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  link?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  progress: number;
  notes?: string;
  isFeatured: boolean;
  isArchived: boolean;
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
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['Active', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      default: 'Active',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 15;
        },
        message: 'Cannot have more than 15 tags',
      },
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator: function (tech: string[]) {
          return tech.length <= 20;
        },
        message: 'Cannot have more than 20 technologies',
      },
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for complex queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, priority: 1 });
projectSchema.index({ userId: 1, isFeatured: 1 });
projectSchema.index({ userId: 1, isArchived: 1 });
projectSchema.index({ userId: 1, dueDate: 1 });
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Middleware to set completedDate when status changes to Completed
projectSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Completed' && !this.completedDate) {
      this.completedDate = new Date();
      if (this.progress < 100) {
        this.progress = 100;
      }
    } else if (this.status !== 'Completed') {
      this.completedDate = undefined;
    }
  }
  next();
});

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
