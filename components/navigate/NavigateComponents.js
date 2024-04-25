import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export function RouteOption({ busLine, tripDuration, tripDistance }) {
    return (
        <TouchableOpacity style={styles.container}>
            <View>
                <Text style={styles.text}>{busLine}</Text>
                <Text style={styles.text}>{tripDuration}</Text>
                <Text style={styles.text}>{tripDistance}</Text>
            </View>
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
        alignItems: 'center', // Center content horizontally
        justifyContent: 'center', // Center content vertically
    },
    headerText: {
        fontSize: 25,
        marginBottom: 5,
    },
    text: {
        fontSize: 18,
        marginBottom: 2,
    },
});
