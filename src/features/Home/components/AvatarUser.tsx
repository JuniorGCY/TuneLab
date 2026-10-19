import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { User } from 'lucide-react-native';

interface AvatarProps {
  imageUrl?: string | null;
  size?: number;
  onPress?: () => void;
}

export function Avatar({ imageUrl, size = 100, onPress }: AvatarProps) {
  const borderRadius = size / 2;

  return (
    <Pressable 
        onPress={onPress} 
        style={({ pressed }) => [
            styles.container,
            { width: size, height: size, borderRadius, opacity: pressed ? 0.7 : 1 }
        ]}
        >
        {imageUrl ? (
            <Image 
            source={{ uri: imageUrl }} 
            style={{ width: size, height: size, borderRadius }} 
            contentFit="cover"
            transition={200}
            />
        ) : (
            <View style={[styles.fallback, { borderRadius }]}>
            <User color="#94a3b8" size={size * 0.5} />
            </View>
        )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    width: '100%',
    height: '100%',
  },
});