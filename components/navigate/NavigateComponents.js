import { React, useMemo, useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Map, { createMarkers, createRoute, createStops } from '../home/Map';

// Displays a button with basic information about a route
export function RouteOption({ busLine, tripDuration, tripDistance, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.headerText}>{busLine}</Text>
            <Text style={[styles.text, styles.textMargin]}>{tripDuration}</Text>
            <Text style={styles.text}>{tripDistance}</Text>
        </TouchableOpacity>
    );
}

// Displays the directions for a route
export function RouteDirections({ route }) {
    const { routeData } = route.params;
    routeData.forEach((element, index) => {
        console.log(`Element ${index + 1}:`);
        console.log(element);
        console.log('\n'); // Add a newline for separation
    });    return (
        <View>
            <Text>Hello!</Text>
        </View>
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
