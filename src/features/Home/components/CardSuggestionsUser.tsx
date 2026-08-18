import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { CardSuggestionsUserProps } from "../types/CardSuggestionsUser";

const { width } = Dimensions.get('window')
const card_width = width * 0.75

export default function CardSuggestionsUser({title, subtitle, onPress}: CardSuggestionsUserProps) {
    return (
        <Pressable style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: card_width,
        height: 80,
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        justifyContent: 'flex-end',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
    },
})