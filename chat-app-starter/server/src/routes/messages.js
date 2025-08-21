import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

async function getConversation(userA, userB) {
  let convo = await Conversation.findOne({ participants: { $all: [userA, userB], $size: 2 } });
  if (!convo) {
    convo = await Conversation.create({ participants: [userA, userB] });
  }
  return convo;
}

router.get('/conversations/:otherId/messages', async (req, res) => {
  const me = req.user.id;
  const other = req.params.otherId;
  const before = req.query.before ? new Date(req.query.before) : new Date();
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const convo = await getConversation(me, other);
  const messages = await Message.find({ conversation: convo._id, createdAt: { $lt: before } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({ conversationId: String(convo._id), messages: messages.reverse() });
});

export default router;
