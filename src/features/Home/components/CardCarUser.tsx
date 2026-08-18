// components/Card.tsx
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import { CardCarUserProps } from '../types/CardCarUser';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

export default function CardCarUser({ title, subtitle, hp, onPress }: CardCarUserProps) {
  return (
    <Pressable style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.subtitle}>{hp}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 160,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    justifyContent: 'flex-end',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
});