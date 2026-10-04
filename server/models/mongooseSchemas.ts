import mongoose, { Schema } from 'mongoose';

// Sirf User model yahan rakho.
// Baaki saare models server/services/db.ts mein hain (string _id ke saath).
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model('User', UserSchema);