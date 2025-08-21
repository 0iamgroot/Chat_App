import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './db.js';
import { initSocket } from './socket.js';
import { auth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import messagesRoutes from './routes/messages.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '').split(','), credentials: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/users', auth, usersRoutes);
app.use('/', auth, messagesRoutes);

const server = http.createServer(app);
initSocket(server, process.env.CORS_ORIGIN || '*');

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`Server listening on :${PORT}`));
});
