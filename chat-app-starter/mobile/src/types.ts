export type User = { id: string; name: string; email: string; online: boolean; lastMessage?: any|null };
export type Message = { id: string; conversationId: string; from: string; to: string; text: string; createdAt: string; deliveredAt?: string; readAt?: string|null; clientId?: string };
