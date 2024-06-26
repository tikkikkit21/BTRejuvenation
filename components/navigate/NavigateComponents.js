import { React, useMemo, useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import MapView, { MapCallout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet from '@gorhom/bottom-sheet';
import { Polyline } from 'react-native-maps';
import { FontAwesome, AntDesign, FontAwesome6, Octicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

// Displays a button with basic information about a route
export function RouteOption({ busLine, tripDuration, tripDistance, routeColor, darkMode, onPress }) {
    // Check if routeColor is an array and extract the color value
    const textColor = routeColor[0].color ? routeColor[0].color : 'black'; // Use the first color or default to white
    const backgroundColor = darkMode ? 'grey' : 'white';

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
            <FontAwesome6 name="bus-simple" size={20} color={textColor} style={{ marginLeft: 10 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 22, color: textColor, textAlign: 'left', fontWeight: 'bold' }}>{busLine}</Text>
                <Text style={{ fontSize: 20, color: textColor }}>{`${tripDuration}`}</Text>
                <Text style={{ fontSize: 20, color: textColor }}>{`${tripDistance}`}</Text>
            </View>
            <View style={{ paddingRight: 10 }}>
                <TouchableOpacity onPress={onPress}>
                    <AntDesign name="right" size={22} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

function getColorByName(busColors, name) {
    for (const busColor of busColors) {
        if (busColor.name === name) {
            return busColor.color; // Return the color if the name matches
        }
        if (name === 'PRG') {
            return '#7156a5';
        }
    }
    return null; // Return null if no match is found
}

// Displays the directions for a route
export function RouteDirections({ route }) {

    // Contains information of route
    const { routeData, routeColor, startDestination, endDestination } = route.params;
    const routeInfo = routeData.routeSteps;

    // Map state variables, sets initial map region
    const [mapRegion, setMapRegion] = useState(null);
    Location.requestForegroundPermissionsAsync();

    // Ref for bottom sheet component
    const bottomSheetRef = useRef(null);

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['35%', '50%', '70%', '95%'], []);
    
    // Calculate map region to fit all points
    useEffect(() => {
        if (routeInfo && routeInfo.length > 0) {
            let minLat = Infinity;
            let maxLat = -Infinity;
            let minLng = Infinity;
            let maxLng = -Infinity;

            // Calculate the bounds of the map region based on route coords
            routeInfo.forEach((element) => {
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
    // Creates the Map with the route directions with necessary icons and info
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
                    {createRouteCoords(routeInfo, routeColor)}
                </MapView>
            )}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <View alignItems="center" justifyContent="center" style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Route Directions</Text>
                    </View>
                    {/* Start Destination */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Entypo name={"location"} size={30} color="green" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 16 }}>Start Destination</Text>
                            <Text style={{ fontSize: 14 }}>{startDestination}</Text>
                            <Text style={{ fontSize: 12 }}>Depart at {routeData.departureTime}</Text>
                        </View>
                    </View>
                    {/* End Destination */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Entypo name={"location"} size={30} color="red" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 16 }}>End Destination</Text>
                            <Text style={{ fontSize: 14 }}>{endDestination}</Text>
                            <Text style={{ fontSize: 12 }}>Arrive at {routeData.arrivalTime}</Text>
                        </View>
                    </View>
                    {/* Total Duration */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                        <MaterialCommunityIcons name="clock" size={32} color="black" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 16 }}>Total Duration</Text>
                            <Text style={{ fontSize: 14 }}>{routeData ? routeData.totalDuration : null}</Text>
                        </View>
                    </View>
                    {/* Instructions */}
                    {Array.isArray(routeInfo) && routeInfo.map((data, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {data.routeName !== null ? (
                                    <MaterialCommunityIcons name="bus" size={30} color={getColorByName(routeColor, data.routeName) || 'black'} />
                                ) : (
                                    <MaterialCommunityIcons name="walk" size={30} color="black" />
                                )}
                                <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 10 }}>{data.routeName ? data.routeName + ' ' + data.instructions : data.instructions}</Text>
                            </View>
                            {/* Check if it's not the last instruction to add the transit-connection icon */}
                            {index !== routeInfo.length - 1 && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 1, marginTop: 7 }}>
                                    <MaterialCommunityIcons name="transit-connection" size={25} color="black" />
                                    <Text>{data.duration}</Text>
                                </View>
                            )}
                        </View>
                    ))}
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
                    strokeColor={getColorByName(color, element.routeName) || 'black'}
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
                        <Entypo name="location" size={24} color="green" />
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
                        <Entypo name="location" size={24} color="red" />
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
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 10,
        width: '90%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
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
