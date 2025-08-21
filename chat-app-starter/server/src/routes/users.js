import express from 'express';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { onlineUserIds } from '../socket.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const me = req.user.id;
  const users = await User.find({ _id: { $ne: me } }).select('_id name email');

  const lastByUser = {};
  const last = await Message.find({ $or: [{ from: me }, { to: me }] })
    .sort({ createdAt: -1 })
    .limit(1000);
  for (const m of last) {
    const other = String(m.from) === String(me) ? String(m.to) : String(m.from);
    if (!lastByUser[other]) lastByUser[other] = m;
  }

  const onlineSet = onlineUserIds();
  res.json(users.map(u => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    online: onlineSet.has(String(u._id)),
    lastMessage: lastByUser[String(u._id)] ? {
      text: lastByUser[String(u._id)].text,
      createdAt: lastByUser[String(u._id)].createdAt,
      from: String(lastByUser[String(u._id)].from),
      readAt: lastByUser[String(u._id)].readAt || null
    } : null
  })));
});

export default router;
