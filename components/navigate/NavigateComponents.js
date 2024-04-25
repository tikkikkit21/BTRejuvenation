import { React, useMemo, useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import MapView, { MapCallout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet from '@gorhom/bottom-sheet';
import { Polyline } from 'react-native-maps';
import { FontAwesome, FontAwesome5, FontAwesome6, Octicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

// Displays a button with basic information about a route
export function RouteOption({ busLine, tripDuration, tripDistance, routeColor, onPress }) {
    const backgroundColor = routeColor === 'black' ? 'black' : `#${routeColor}`;
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: backgroundColor }]} onPress={onPress}>
            <Text style={styles.headerText}>{busLine}</Text>
            <Text style={[styles.text, styles.textMargin]}>{tripDuration}</Text>
            <Text style={styles.text}>{tripDistance}</Text>
        </TouchableOpacity>
    );
}

// Displays the directions for a route
export function RouteDirections({ route }) {

    // Contains information of route
    const { routeData, routeColor, routeTextColor, startDestination, endDestination } = route.params;

    // Map state variables, sets initial map region
    const [mapRegion, setMapRegion] = useState(null);
    Location.requestForegroundPermissionsAsync();

    // Ref for bottom sheet component
    const bottomSheetRef = useRef(null);

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['30%', '50%', '70%', '95%'], []);
    
    // Calculate map region to fit all points
    useEffect(() => {
        if (routeData && routeData.length > 0) {
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

            // Set Map Region based on the bounds of the route
            setMapRegion({
                latitude: (minLat + maxLat) / 2,
                longitude: (minLng + maxLng) / 2,
                latitudeDelta: 0.051202637986392574,
                longitudeDelta: 0.03720943536600885,
            });
        }
    }, [routeData]); 
    
    return (
        <View style={{ flex: 1 }}>
            {mapRegion && ( // Render map only when mapRegion is available
                <MapView
                    style={{ flex: 1 }}
                    region={mapRegion}
                    onRegionChangeComplete={(region) => setMapRegion(region)}
                    showsUserLocation={true}
                >
                    {/* Create markers for route */}
                    {createRouteCoords(routeData, routeColor)}
                </MapView>
            )}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <View alignItems={'center'} justifyContent={'center'}>
                    <Text style={{ backgroundColor: routeColor === 'black' ? 'black' : `#${routeColor}`, fontSize: 20, fontWeight: 'bold'}}>Route Directions</Text>
                    <FlatList
                        data={[
                            { key: 'Start Destination', value: startDestination, icon: 'human-male' },
                            { key: 'End Destination', value: endDestination, icon: 'human-male' },
                            { key: 'Total Duration', value: routeData[0].totalDuration, icon: 'clock' },
                            { key: 'Instructions', value: routeData.map(data => data.instructions).join('\n'), icon: 'directions' }
                        ]}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                {item.key !== "Instructions" && (
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        {item.key === 'Start Destination' && (
                                            <MaterialCommunityIcons name={item.icon} size={35} color="green" />
                                        )}
                                        {item.key === 'End Destination' && (
                                            <MaterialCommunityIcons name={item.icon} size={35} color="red" />
                                        )}
                                        {item.key === 'Total Duration' && (
                                            <MaterialCommunityIcons name={item.icon} size={35} color="black" />
                                        )}
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 16 }}>{item.key}</Text>
                                            <Text style={{ fontSize: 14 }}>{item.value}</Text>
                                        </View>
                                    </View>
                                )}
                                <View style={{ marginLeft: 10 }}>
                                    {item.key === 'Instructions' && routeData.map(data => (
                                        <View key={data.instructions} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {data.routeName !== null ? (
                                                <MaterialCommunityIcons name="bus" size={30} color={routeColor === 'black' ? 'black' : `#${routeColor}`} />
                                            ) : (
                                                <MaterialCommunityIcons name="walk" size={30} color="black" />
                                            )}
                                            <Text style={{ fontSize: 14, fontWeight:'bold' }}>{data.instructions}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    />
                </View>
            </BottomSheet>
        </View>
    );
}

// Create icons for stop markers en route
export function createRouteCoords(route, color) {
    // Contains information of route
    const markers = [];
    const polylines = [];

    route.forEach((element, index) => {
        // If the element has a valid routeName, create a polyline
        if (element.routeName !== null) {
            const points = element.points.map(point => ({
                latitude: point.latitude,
                longitude: point.longitude
            }));

            polylines.push(
                <Polyline
                    key={`polyline-${index}`}
                    coordinates={points}
                    strokeWidth={5}
                    strokeColor={color === 'black' ? 'black' : `#${color}`}
                />
            );
        } else {
            // Iterate over each point in the element's point array
            element.points.forEach((point, pointIndex) => {
                // Skip a certain number of points before adding a marker
                if (pointIndex % 2 === 0) {
                    // Determine the coordinate for the marker
                    const coordinate = {
                        latitude: point.latitude,
                        longitude: point.longitude
                    };

                    // Push a Marker component into the markers array
                    markers.push(
                        <Marker
                            key={`${index}-${pointIndex}`} // Unique key for each Marker
                            coordinate={coordinate}
                        >
                            <View>
                                <Octicons name="dot-fill" size={15} color="black" />
                            </View>
                        </Marker>
                    );
                }
            });
        }
        // Add markers to the first and last coordinates of the route
        if (route.length > 0) {
            const firstPoint = route[0].points[0];
            const lastSegment = route[route.length - 1];
            const lastPoint = lastSegment.points[lastSegment.points.length - 1];

            // Add icon to the first coordinate (starting point)
            markers.push(
                <Marker
                    key={`startMarker-${Math.random()}`}
                    coordinate={{ latitude: firstPoint.latitude, longitude: firstPoint.longitude }}
                >
                    <View>
                        <MaterialCommunityIcons name="human-male" size={24} color="green" />
                    </View>
                </Marker>
            );

            // Add icon to the last coordinate (end destination)
            markers.push(
                <Marker
                    key={`endMarker-${Math.random()}`}
                    coordinate={{ latitude: lastPoint.latitude, longitude: lastPoint.longitude }}
                >
                    <View>
                        <MaterialCommunityIcons name="human-male" size={30} color="red" />
                    </View>
                </Marker>
            );
        }
    });

    // Return the array of Marker components and Polylines
    return [...markers, ...polylines];
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
