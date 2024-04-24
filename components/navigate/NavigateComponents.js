import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export function RouteOption({ busLine, tripDuration, tripDistance }) {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.text}>{busLine}</Text>
            <Text>{tripDuration}</Text>
            <Text>{tripDistance}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: '80%',
        height: 150, // Adjust the height according to your preference
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        elevation: 2, // For shadow effect (Android)
        shadowColor: 'black', // For shadow effect (iOS)
        shadowOpacity: 0.3, // For shadow effect (iOS)
        shadowOffset: { width: 0, height: 2 }, // For shadow effect (iOS)
        shadowRadius: 3, // For shadow effect (iOS)
    },
    text: {
        textAlign: 'left',  // Align questions on left side of screen
        fontSize: 18,
        marginBottom: 5,
    },
});
