import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme';
import { Message } from '../types';

export default function MessageBubble({ msg, me }: { msg: Message; me: string }) {
  const isMe = msg.from === me;
  return (
    <View style={{ padding: 6, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
      <View style={{ backgroundColor: isMe ? colors.me : colors.them, padding: 10, borderRadius: 12, maxWidth: '80%' }}>
        <Text style={{ color: colors.text }}>{msg.text}</Text>
        <Text style={{ color: colors.sub, fontSize: 10, marginTop: 4 }}>
          {msg.readAt ? '✓✓ Read' : msg.deliveredAt ? '✓✓ Delivered' : '✓ Sent'}
        </Text>
      </View>
    </View>
  );
}
