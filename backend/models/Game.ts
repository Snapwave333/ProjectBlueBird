
import { Schema, model, Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  genre: string;
  releaseDate: Date;
  developer: string;
}

const GameSchema = new Schema<IGame>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  developer: { type: String, required: true },
});

export default model<IGame>('Game', GameSchema);
