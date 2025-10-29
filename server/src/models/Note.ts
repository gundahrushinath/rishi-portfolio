import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: 'Personal' | 'Work' | 'Study' | 'Ideas' | 'Code Snippet' | 'Meeting' | 'Other';
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  color: string;
  reminder?: Date;
  collaborators: mongoose.Types.ObjectId[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: mongoose.Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [50000, 'Content cannot exceed 50000 characters'],
    },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'Study', 'Ideas', 'Code Snippet', 'Meeting', 'Other'],
      default: 'Personal',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 20;
        },
        message: 'Cannot have more than 20 tags',
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#ffffff',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'],
    },
    reminder: {
      type: Date,
      default: null,
    },
    collaborators: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
    }],
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ category: 1 });
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
