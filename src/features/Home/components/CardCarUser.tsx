import React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { CardCarUserProps } from '../types/CardCarUser';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@/constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

export default function CardCarUser({ title, subtitle, hp, imageUrl, onPress }: CardCarUserProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: imageUrl}}
        style={styles.imageBackground}
        contentFit="cover"
        transition={300}
        cachePolicy="disk"
      />
      
      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
           <Text style={styles.subtitle}>{subtitle}</Text>
           {hp ? <Text style={styles.subtitle}>{hp}</Text> : null}
        </View>
       
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    padding: 20,
    zIndex: 1,
  },
  title: {
    fontSize: RFValue(14),
    fontFamily: FONTS.Montserrat.regular,
    color: '#fff',
  },
  subtitle: {
    fontSize: RFValue(9),
    fontFamily: FONTS.Montserrat.bold,
    color: '#ccc',
    marginTop: 4,
  },
});