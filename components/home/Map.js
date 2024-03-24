import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getAllBuses } from '../../backend/busController';
import { FontAwesome, FontAwesome6, MaterialIcons, Octicons } from '@expo/vector-icons';

import appStyles from '../../styles/App.style';
import styles from '../../styles/HomeTab.style';
import { getStops } from '../../backend/stopController';

function Map({ navigation }) {
    const [buses, setBuses] = useState([]);
    const [stops, setStops] = useState([]);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const refreshTimer = useRef(null);

    useEffect(() => {
        loadBuses();
        refreshTimer.current = setInterval(() => {
            loadBuses();
        }, 10000);

        return () => {
            clearInterval(refreshTimer.current);
        };
    }, []);

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

    async function loadBuses() {
        const buses = await getAllBuses();
        setBuses(buses);
    }

    async function handleMarkerSelect(busCode) {
        const stops = await getStops(busCode);
        setStops(stops);
    }

    return (
        <View style={appStyles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.227613,
                    longitude: -80.422137,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0121,
                }}
                showsUserLocation={true}
            >
                {createMarkers(buses, handleMarkerSelect)}
                {createStops(stops)}
                {stops.length != 0 && createRoute(stops)}
            </MapView>
            <View style={styles.refreshButton}>
                <TouchableOpacity onPress={handleRefreshClick}>
                    <FontAwesome name="refresh" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.feedbackButton}>
                <TouchableOpacity onPress={() => navigation.navigate("Feedback")}>
                    <MaterialIcons name="feedback" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

function createMarkers(buses, handleSelect) {
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
                onSelect={() => { handleSelect(busObj.RouteShortName) }}
            >
                <View>
                    <FontAwesome6 name="bus-simple" size={30} color="black" />
                </View>
            </Marker>
        )
    });
}

function createStops(stops) {
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
                <Octicons name="dot-fill" size={30} color="red" />
            </View>
        </Marker>
    )
}

function createRoute(stops) {
    const coords = stops.map(stop => {
        return {
            latitude: stop.Latitude,
            longitude: stop.Longitude
        }
    });

    const mapCoords = format(coords);

    return mapCoords.map((mc, index) => {
        return (
            <MapViewDirections
                key={index}
                origin={mc[0]}
                destination={mc[mc.length - 1]}
                waypoints={mc.slice(1, mc.length - 1)}
                apikey={process.env.GOOGLE_MAPS_API_KEY}
                strokeWidth={2}
                strokeColor="#ff0000"
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

export default Map;
