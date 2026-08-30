import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { CardSuggestionsUserProps } from "../types/CardSuggestionsUser";
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@/constants/fonts';

import { Cpu} from "lucide-react-native";

const { width } = Dimensions.get('window')
const card_width = width * 0.75

export default function CardSuggestionsUser({title, subtitle, onPress}: CardSuggestionsUserProps) {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={{marginHorizontal: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Cpu color={"#FF6B00"} size={30}/>
            </View>

            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: card_width,
        height: 80,
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        borderWidth: 0.2,
        borderColor: '#ccc',
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-start',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.regular,
        color: '#fff'
    },
    subtitle: {
        fontSize: RFValue(10),
        fontFamily: FONTS.Montserrat.regular,
        color: '#fff'
    },
})