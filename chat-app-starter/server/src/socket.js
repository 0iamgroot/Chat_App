import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

const online = new Map(); // userId -> Set(socketId)
export const onlineUserIds = () => new Set(Array.from(online.keys()));

function joinUserRoom(io, userId, socket) {
  socket.join(`user:${userId}`);
}

async function getConversation(userA, userB) {
  let convo = await Conversation.findOne({ participants: { $all: [userA, userB], $size: 2 } });
  if (!convo) convo = await Conversation.create({ participants: [userA, userB] });
  return convo;
}

export const initSocket = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, { cors: { origin: corsOrigin.split(','), credentials: true } });

  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth || {};
      if (!token) return next(new Error('No token'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = String(payload.id);
      next();
    } catch (e) { next(e); }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    if (!online.has(userId)) online.set(userId, new Set());
    online.get(userId).add(socket.id);
    joinUserRoom(io, userId, socket);
    socket.broadcast.emit('presence:online', { userId });

    socket.on('typing:start', ({ to }) => {
      io.to(`user:${to}`).emit('typing:start', { from: userId });
    });
    socket.on('typing:stop', ({ to }) => {
      io.to(`user:${to}`).emit('typing:stop', { from: userId });
    });

    socket.on('message:send', async ({ to, text, clientId }) => {
      const convo = await getConversation(userId, to);
      const msg = await Message.create({
        conversation: convo._id,
        from: userId,
        to,
        text,
        deliveredAt: new Date(),
        clientId: clientId || null,
      });
      await Conversation.findByIdAndUpdate(convo._id, { lastMessageAt: new Date(), lastMessageText: text });

      socket.emit('message:delivered', { clientId, serverId: String(msg._id) });

      io.to(`user:${to}`).emit('message:new', { message: {
        id: String(msg._id),
        conversationId: String(convo._id),
        from: userId,
        to,
        text,
        createdAt: msg.createdAt,
        deliveredAt: msg.deliveredAt,
        readAt: msg.readAt || null,
        clientId: clientId || null,
      }});
    });

    socket.on('message:read', async ({ conversationId, messageIds }) => {
      await Message.updateMany(
        { _id: { $in: messageIds }, conversation: conversationId },
        { $set: { readAt: new Date() } }
      );
      const msgs = await Message.find({ _id: { $in: messageIds } });
      const bySender = new Map();
      for (const m of msgs) {
        const s = String(m.from);
        if (!bySender.has(s)) bySender.set(s, []);
        bySender.get(s).push(String(m._id));
      }
      for (const [senderId, ids] of bySender) {
        const payload = { conversationId, messageIds: ids, readerId: userId };
        io.to(`user:${senderId}`).emit('message:read', payload);
      }
    });

    socket.on('disconnect', () => {
      if (online.has(userId)) {
        online.get(userId).delete(socket.id);
        if (online.get(userId).size === 0) {
          online.delete(userId);
          socket.broadcast.emit('presence:offline', { userId });
        }
      }
    });
  });

  return io;
};
