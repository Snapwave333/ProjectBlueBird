
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  gameData: {
    level: number;
    xp: number;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
  },
  gameData: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>('User', UserSchema);
