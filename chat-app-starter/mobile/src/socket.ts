import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';

const SOCKET_URL = (Constants as any).expoConfig?.extra?.SOCKET_URL || process.env.SOCKET_URL || 'http://localhost:4000';

export function createSocket(token: string): Socket {
  const socket: Socket = io(SOCKET_URL, { autoConnect: true, transports: ['websocket'], auth: { token } });
  return socket;
}
