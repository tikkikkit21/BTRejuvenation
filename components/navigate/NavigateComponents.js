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
    const [mapRegion, setMapRegion] = useState(null);
    Location.requestForegroundPermissionsAsync();

    // Ref for bottom sheet component
    const bottomSheetRef = useRef(null);

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['30%', '50%', '70%', '95%'], []);

    // Calculate map region to fit all points
    useEffect(() => {
        if (routeData.length > 0) {
            let minLat = Infinity;
            let maxLat = -Infinity;
            let minLng = Infinity;
            let maxLng = -Infinity;

            // Calculate the bounds of the map region based on route coords
            routeData.forEach((element) => {
                element.points.forEach((point) => {
                    minLat = Math.min(minLat, point.latitude);
                    maxLat = Math.max(maxLat, point.latitude);
                    minLng = Math.min(minLng, point.longitude);
                    maxLng = Math.max(maxLng, point.longitude);
                });
            });

            // Add padding to the bounding box
            const latPadding = 0.01;
            const longPadding = 0.03;

            // Set Map Region based on the bounds of the route
            setMapRegion({
                latitude: (minLat + maxLat) / 2,
                longitude: (minLng + maxLng) / 2,
                latitudeDelta: (maxLat - minLat) + latPadding,
                longitudeDelta: (maxLng - minLng) + longPadding,
            });
        }
    }, [routeData]);

    // routeData.forEach((element, index) => {
    //     console.log(`Element ${index + 1}:`);
    //     console.log(element);
    //     console.log('\n'); // Add a newline for separation
    // });    
    
    return (
        <View style={{ flex: 1 }}>
            {mapRegion && ( // Render map only when mapRegion is available
                <MapView
                    style={{ flex: 1 }}
                    region={mapRegion}
                >
                    {routeData.map((element, index) => (
                        <Marker
                            key={index}
                            coordinate={element.points[0]} // You can choose any point in the element
                            title={element.instructions}
                        />
                    ))}
                </MapView>
            )}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <View alignItems={'center'} justifyContent={'center'}>
                    <Text>ROUTE DIRECTIONS</Text>
                </View>
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
