# Chat App (React Native + Node.js)

MVP features:
- JWT auth (register/login)
- User list with online/offline + last message
- 1:1 chats with real-time Socket.IO
- Messages persisted in MongoDB
- Typing indicators, delivery & read receipts

## Quick Start

### Prereqs
- Node.js >= 18
- Yarn or npm
- MongoDB (local or cloud)
- Expo CLI for React Native (recommended)

### 1) Server
```bash
cd server
cp .env.example .env  # fill in values
npm install
npm run dev
# Server on http://localhost:4000
```

### 2) Mobile
```bash
cd mobile
cp .env.example .env  # set API_BASE and SOCKET_URL
npm install
npm run start
# Press 'a' for Android emulator, 'i' for iOS, or scan QR in Expo Go
```

## Env Vars
- **Server**: see `server/.env.example`
- **Mobile**: see `mobile/.env.example`

## API
- `POST /auth/register` `{name, email, password}`
- `POST /auth/login` `{email, password}` → `{token, user}`
- `GET /users` (auth) → list users with `online` flag & `lastMessage`
- `GET /conversations/:id/messages` (auth) → messages with pagination (`?before`, `?limit`)

## Socket Events
- `message:send` → `{to, text, clientId}`
- `message:new` → `{message}` (incoming messages)
- `typing:start|stop` → `{to}`
- `message:read` → `{conversationId, messageIds}`
- `message:delivered` → `{clientId, serverId}` (server ack)
- `presence:online` / `presence:offline` broadcast with `{userId}`

Notes:
- 1:1 conversations are created on first message; id is stable per pair.
- Presence/typing use Socket.IO rooms per `user:<id>`.
- Read receipts mark `readAt` and notify the sender.
