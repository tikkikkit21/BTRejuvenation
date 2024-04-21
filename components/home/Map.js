import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import MapView, { MapCallout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { getAllBuses } from '../../backend/busController';
import { FontAwesome, FontAwesome6, Octicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import appStyles from '../../styles/App.style';
import { getStops } from '../../backend/stopController';

export default function Map({ navigation }) {
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.227468937500895,
        longitude: -80.42357646125542,
        latitudeDelta: 0.051202637986392574,
        longitudeDelta: 0.03720943536600885,
    })
    const [buses, setBuses] = useState([]);
    const [stops, setStops] = useState([]);
    const [route, setRoute] = useState();
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const refreshTimer = useRef(null);

    // ask for user location
    Location.requestForegroundPermissionsAsync();

    // automatically refresh bus locations every 10s
    useEffect(() => {
        loadBuses();
        refreshTimer.current = setInterval(() => {
            loadBuses();
        }, 10000);

        return () => {
            clearInterval(refreshTimer.current);
        };
    }, []);

    // refresh button has a 5s cooldown, and resets the automatic refresh
    function handleRefreshClick() {
        if (!isOnCooldown) {
            clearInterval(refreshTimer.current);
            refreshTimer.current = setInterval(loadBuses, 10000);

            loadBuses();

            setIsOnCooldown(true);
            setTimeout(() => {
                setIsOnCooldown(false);
            }, 5000);
        }
    }

    // centers user on the map and zooms in a bit
    async function handleLocationClick() {
        const location = await Location.getCurrentPositionAsync({});
        setMapRegion({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            latitudeDelta: 0.00964806666502227,
            longitudeDelta: 0.008857245616368914
        })
    }

    // fetches bus data from backend
    async function loadBuses() {
        const buses = await getAllBuses();
        setBuses(buses);
    }

    // fetches stop data for a particular bus
    async function handleMarkerSelect(busCode) {
        const stops = await getStops(busCode);
        setStops(stops);
    }

    // redraw route only when stops change
    useEffect(() => {
        setRoute(createRoute(stops));
    }, [stops]);

    return (
        <View style={appStyles.container}>
            <MapView
                style={styles.map}
                region={mapRegion}
                onRegionChangeComplete={(region) => setMapRegion(region)}
                showsUserLocation={true}
            >
                {createMarkers(buses, handleMarkerSelect)}
                {createStops(stops)}
                {route}
            </MapView>
            <View style={styles.refreshButton}>
                <TouchableOpacity onPress={handleRefreshClick}>
                    <MaterialCommunityIcons name="restart" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.feedbackButton}>
                <TouchableOpacity onPress={() => navigation.navigate("Feedback")}>
                    <FontAwesome6 name="qrcode" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.locationButton}>
                <TouchableOpacity onPress={handleLocationClick}>
                    <Entypo name="direction" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

// creates bus icons for each bus in the bus data
export function createMarkers(buses, handleSelect, color) {
    return buses.map(busObj => {
        return (
            <Marker
                key={busObj.AgencyVehicleName}
                coordinate={{
                    latitude: busObj.Latitude,
                    longitude: busObj.Longitude
                }}
                title={busObj.RouteShortName}
                description={`Last stop: ${busObj.LastStopName}`}
                pointerEvents="auto"
                // For the route tab the handleseelct is not necesary, as we know bus info already
                onSelect={handleSelect ? () => { handleSelect(busObj.RouteShortName) } : null}
            >
                <View>
                    <FontAwesome6 name="bus-simple" size={30} color={color ? '#' + color : 'black'} />
                </View>
            </Marker>
        )
    });
}

// creates circles for each stop
export function createStops(stops, color) {
    return stops.map(stopObj =>
        <Marker
            key={stopObj.StopCode}
            coordinate={{
                latitude: stopObj.Latitude,
                longitude: stopObj.Longitude
            }}
            title={stopObj.StopCode}
            description={stopObj.StopName}
            pointerEvents="auto"
        >
            <View>
                <Octicons name="dot-fill" size={30} color={color ? '#' + color : 'red'} />
            </View>
        </Marker>
    )
}

// uses Google Maps API to trace the route between stops (not perfect)
export function createRoute(stops, color) {
    const routeColor = color ? '#' + color : '#ff0000';
    const coords = stops.map(stop => {
        return {
            latitude: Number(stop.Latitude),
            longitude: Number(stop.Longitude)
        }
    });

    const mapCoords = format(coords);

    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.log("GOOGLE_MAPS_API_KEY missing");
        return;
    }

    return mapCoords.map((mc, index) => {
        return (
            <MapViewDirections
                key={index}
                origin={mc[0]}
                destination={mc[mc.length - 1]}
                waypoints={mc.slice(1, mc.length - 1)}
                apikey={process.env.GOOGLE_MAPS_API_KEY}
                strokeWidth={2}
                strokeColor={routeColor}
            />
        );
    });
}

// Google API can only handle up to 25 waypoints, so if a bus has more stops,
// split into 2 MapViewDirections
function format(coords) {
    coords.push(coords[0]);

    if (coords.length <= 27) {
        return [coords];
    }

    return [coords.slice(0, 20), coords.slice(19, coords.length)];
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    refreshButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#A40046',
        padding: 13,
        borderRadius: 15
    },
    feedbackButton: {
        position: 'absolute',
        top: 80,
        right: 10,
        backgroundColor: '#A40046',
        padding: 16,
        borderRadius: 15
    },
    locationButton: {
        position: 'absolute',
        top: 150,
        right: 10,
        backgroundColor: '#A40046',
        padding: 15,
        borderRadius: 15
    }
});
