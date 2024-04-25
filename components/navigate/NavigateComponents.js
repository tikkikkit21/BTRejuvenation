import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export function RouteOption({ busLine, tripDuration, tripDistance }) {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.headerText}>{busLine}</Text>
            <Text style={[styles.text, styles.textMargin]}>{tripDuration}</Text>
            <Text style={styles.text}>{tripDistance}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 25,
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        marginBottom: 2,
    },
    textMargin: {
        marginTop: 5,
    },
});
