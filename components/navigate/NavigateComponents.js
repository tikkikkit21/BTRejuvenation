import { React, useMemo, useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { MapCallout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Map, { createMarkers, createRoute, createStops } from '../home/Map';
import BottomSheet from '@gorhom/bottom-sheet';

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

    // Contains information of route
    const { routeData } = route.params;

    // Map state variables, sets initial map region
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.227468937500895,
        longitude: -80.42357646125542,
        latitudeDelta: 0.051202637986392574,
        longitudeDelta: 0.03720943536600885,
    });
    Location.requestForegroundPermissionsAsync();

    // Ref for bottom sheet component
    const bottomSheetRef = useRef(null);

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['30%', '50%', '70%', '95%'], []);

    useEffect(() => {
        // logic to set the initial map region based on the routeData, if needed
    }, []);

    routeData.forEach((element, index) => {
        console.log(`Element ${index + 1}:`);
        console.log(element);
        console.log('\n'); // Add a newline for separation
    });    
    
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={mapRegion}
            >
                {/* Render markers or routes on the map based on routeData */}
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <View>
                    <Text>ROUTE DIRECTIONS</Text>
                </View>
                {/* Render your bottom sheet content here, displaying route information */}
            </BottomSheet>
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
