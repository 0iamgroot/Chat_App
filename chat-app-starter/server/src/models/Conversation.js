import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
  lastMessageAt: { type: Date },
  lastMessageText: { type: String },
}, { timestamps: true });

ConversationSchema.index({ participants: 1 }, { unique: false });

export default mongoose.model('Conversation', ConversationSchema);
