import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, FlatList, Pressable, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { api } from '../api';
import { colors } from '../theme';
import { Message } from '../types';
import { createSocket } from '../socket';
import MessageBubble from '../components/MessageBubble';
import TypingDots from '../components/TypingDots';

export default function ChatScreen({ route }: NativeStackScreenProps<RootStackParamList, 'Chat'>) {
  const { userId, name } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const meRef = useRef<string>('me'); // updated after first fetch
  const socketRef = useRef<any>(null);
  const typingTimeout = useRef<any>(null);

  const fetchMessages = async () => {
    const { data } = await api.get(`/conversations/${userId}/messages`);
    setConversationId(data.conversationId);
    setMessages(data.messages);
    if (data.messages.length) {
      meRef.current = data.messages[0].from === userId ? data.messages[0].to : data.messages[0].from;
    }
  };

  useEffect(() => { fetchMessages(); }, [userId]);

  useEffect(() => {
    let active = true;
    (async () => {
      // grab token from axios defaults
      const authHeader = (api.defaults.headers as any).common?.Authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      const socket = createSocket(token);
      socketRef.current = socket;

      socket.on('message:new', ({ message }: { message: Message }) => {
        if (!active) return;
        if (message.from === userId || message.to === userId) {
          setMessages((prev) => [...prev, message]);
        }
      });
      socket.on('message:delivered', ({ clientId, serverId }: any) => {
        setMessages((prev) => prev.map(m => m.clientId === clientId ? { ...m, id: serverId, deliveredAt: new Date().toISOString() } as any : m));
      });
      socket.on('typing:start', ({ from }: any) => { if (from === userId) setTyping(true); });
      socket.on('typing:stop', ({ from }: any) => { if (from === userId) setTyping(false); });
      socket.on('message:read', ({ conversationId: cId, messageIds }: any) => {
        if (cId !== conversationId) return;
        setMessages((prev) => prev.map(m => messageIds.includes(m.id) ? { ...m, readAt: new Date().toISOString() } as any : m));
      });

    })();
    return () => { active = false; socketRef.current?.disconnect(); };
  }, [userId, conversationId]);

  const onSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const clientId = 'c_' + Math.random().toString(36).slice(2);
    const msg: Message = {
      id: clientId,
      conversationId: conversationId || 'temp',
      from: meRef.current,
      to: userId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      clientId
    };
    setMessages((prev) => [...prev, msg]);
    socketRef.current?.emit('message:send', { to: userId, text: trimmed, clientId });
    setText('');
    socketRef.current?.emit('typing:stop', { to: userId });
  };

  const onTyping = (t: string) => {
    setText(t);
    socketRef.current?.emit('typing:start', { to: userId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socketRef.current?.emit('typing:stop', { to: userId }), 800);
  };

  // Mark all received (to me) as read when opening
  useEffect(() => {
    if (!conversationId) return;
    const toRead = messages.filter(m => m.to === meRef.current && !m.readAt).map(m => m.id);
    if (toRead.length) {
      socketRef.current?.emit('message:read', { conversationId, messageIds: toRead });
    }
  }, [conversationId, messages.length]);

  const renderItem = ({ item }: { item: Message }) => <MessageBubble msg={item} me={meRef.current} />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex:1, backgroundColor: colors.bg }}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
      {typing && <TypingDots />}
      <View style={{ flexDirection:'row', padding: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
        <TextInput
          value={text}
          onChangeText={onTyping}
          placeholder={`Message ${name}`}
          placeholderTextColor={colors.sub}
          style={{ flex:1, color: colors.text, backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8 }}
        />
        <Pressable onPress={onSend} style={{ backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent:'center' }}>
          <Text style={{ color: 'white', fontWeight:'700' }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
