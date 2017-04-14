import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const laneSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  notes: [{ type: Schema.ObjectId, ref: 'Note', required: true }],
});

export default mongoose.model('Lane', laneSchema);
