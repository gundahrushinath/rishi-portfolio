import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Completed' | 'Cancelled';
  category: 'Work' | 'Personal' | 'Study' | 'Health' | 'Shopping' | 'Other';
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  subtasks: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  recurring?: {
    enabled: boolean;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    endDate?: Date;
  };
  reminder?: Date;
  notes?: string;
  dependencies: mongoose.Types.ObjectId[]; // IDs of tasks that must be completed first
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Todo',
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Study', 'Health', 'Shopping', 'Other'],
      default: 'Personal',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
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
    subtasks: [{
      title: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
        default: null,
      },
    }],
    estimatedTime: {
      type: Number,
      default: null,
    },
    actualTime: {
      type: Number,
      default: null,
    },
    recurring: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
      },
      endDate: {
        type: Date,
      },
    },
    reminder: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    dependencies: [{
      type: Schema.Types.ObjectId,
      ref: 'Todo',
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
todoSchema.index({ userId: 1, status: 1, createdAt: -1 });
todoSchema.index({ userId: 1, dueDate: 1 });
todoSchema.index({ userId: 1, priority: 1 });
todoSchema.index({ category: 1 });
todoSchema.index({ title: 'text', description: 'text' });

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;
