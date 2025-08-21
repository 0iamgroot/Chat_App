import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { colors } from '../theme';

export default function TypingDots() {
  const [dots, setDots] = useState('.');
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '.' : d + '.')), 400);
    return () => clearInterval(id);
  }, []);
  return <Text style={{ color: colors.sub, margin: 8 }}>typing{dots}</Text>;
}
