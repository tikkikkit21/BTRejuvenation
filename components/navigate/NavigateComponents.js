import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export function RouteOption({ busLine, tripDuration, tripDistance }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.innerContainer}>
                <Text style={styles.text}>{busLine}</Text>
                <Text>{tripDuration}</Text>
                <Text>{tripDistance}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'flex-start', // Align content to the left
        justifyContent: 'center',
        margin: 10,
        width: '80%',
        height: 150,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    text: {
        textAlign: 'left',
        fontSize: 18,
        marginBottom: 5,
    },
});

