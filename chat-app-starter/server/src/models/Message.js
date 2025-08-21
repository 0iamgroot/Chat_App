import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', index: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  text: { type: String, required: true },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  clientId: { type: String },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
