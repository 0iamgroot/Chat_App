import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { setToken } from './src/api';
import { getToken } from './src/auth';

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => { (async () => {
    const t = await getToken(); if (t) setToken(t); setReady(true);
  })(); }, []);
  if (!ready) return null;
  return <><RootNavigator /><StatusBar style="light" /></>;
}
