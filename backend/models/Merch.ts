
import { Schema, model, Document } from 'mongoose';

export interface IMerch extends Document {
  name: string;
  description: string;
  price: number;
  inStock: number;
}

const MerchSchema = new Schema<IMerch>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Number, required: true },
});

export default model<IMerch>('Merch', MerchSchema);
