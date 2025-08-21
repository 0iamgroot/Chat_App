import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (e) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
};
