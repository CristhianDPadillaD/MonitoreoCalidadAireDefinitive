import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true
    },
    name: String,
    email: {
      type: String,
      unique: true
    },
    role: {
      type: String,
      enum: ['investigator', 'admin'],
      default: 'investigator'
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
