import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { api } from '../api';
import { colors } from '../theme';
import { User } from '../types';

export default function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { const unsub = navigation.addListener('focus', load); return unsub; }, [navigation]);

  const renderItem = ({ item }: { item: User }) => (
    <Pressable onPress={() => navigation.navigate('Chat', { userId: item.id, name: item.name })} style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection:'row', alignItems:'center' }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.online ? '#2ecc71' : '#7f8c8d', marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight:'600' }}>{item.name}</Text>
        <Text style={{ color: colors.sub, fontSize: 12 }} numberOfLines={1}>
          {item.lastMessage?.text || 'Start chatting'}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={<Text style={{ color: colors.sub, textAlign:'center', marginTop: 24 }}>No users yet</Text>}
      />
    </View>
  );
}
