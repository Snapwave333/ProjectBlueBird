
import { Schema, model, Document, Types } from 'mongoose';

export interface ITournament extends Document {
  game: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  participants: Types.ObjectId[];
}

const TournamentSchema = new Schema<ITournament>({
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default model<ITournament>('Tournament', TournamentSchema);
