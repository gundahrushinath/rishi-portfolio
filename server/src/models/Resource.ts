import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail?: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: 'No description provided',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: ['Tutorial', 'Article', 'Video', 'Course', 'Tool', 'Documentation', 'Library', 'Other'],
      default: 'Other',
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: function (url: string) {
          // Basic URL validation
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Please provide a valid URL',
      },
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
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
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
resourceSchema.index({ userId: 1, createdAt: -1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ isFeatured: 1 });

const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource;
