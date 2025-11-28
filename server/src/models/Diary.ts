import mongoose, { Document, Schema } from 'mongoose';

export interface IDiary extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mood: 'Happy' | 'Neutral' | 'Sad' | 'Excited' | 'Tired' | 'Stressed' | 'Grateful';
  tags: string[];
  date: Date;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const diarySchema = new Schema<IDiary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    mood: {
      type: String,
      enum: ['Happy', 'Neutral', 'Sad', 'Excited', 'Tired', 'Stressed', 'Grateful'],
      default: 'Neutral',
      index: true,
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
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
diarySchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IDiary>('Diary', diarySchema);
