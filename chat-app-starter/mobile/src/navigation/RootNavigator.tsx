import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chat: { userId: string; name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0b1216' }, headerTintColor: '#e6edf3' }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Chats' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.name })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
