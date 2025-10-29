import mongoose, { Document, Schema } from 'mongoose';

export interface IDiary extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  date: Date;
  mood: 'Happy' | 'Sad' | 'Neutral' | 'Excited' | 'Anxious' | 'Grateful' | 'Tired' | 'Motivated';
  weather?: string;
  tags: string[];
  isPrivate: boolean;
  location?: string;
  images: string[];
  gratitudeList: string[];
  goals: {
    description: string;
    completed: boolean;
  }[];
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
      required: [true, 'Diary title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Diary content is required'],
      maxlength: [100000, 'Content cannot exceed 100000 characters'],
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    mood: {
      type: String,
      enum: ['Happy', 'Sad', 'Neutral', 'Excited', 'Anxious', 'Grateful', 'Tired', 'Motivated'],
      default: 'Neutral',
    },
    weather: {
      type: String,
      trim: true,
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
    isPrivate: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    gratitudeList: {
      type: [String],
      default: [],
    },
    goals: [{
      description: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
diarySchema.index({ userId: 1, date: -1 });
diarySchema.index({ userId: 1, mood: 1 });
diarySchema.index({ title: 'text', content: 'text', tags: 'text' });

const Diary = mongoose.model<IDiary>('Diary', diarySchema);

export default Diary;
