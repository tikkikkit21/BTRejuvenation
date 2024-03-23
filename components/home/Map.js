import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
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
        console.log("marker pressed:", busCode);
        const stops = await getStops(busCode);
        setStops(stops);
    }

    async function handleMarkerDeselect() {
        console.log("marker unselected:");
        setStops([]);
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
                {createMarkers(buses, handleMarkerSelect, handleMarkerDeselect)}
                {createStops(stops)}
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

function createMarkers(buses, handleSelect, handleDeselect) {
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
                onSelect={() => { handleSelect(busObj.RouteShortName) }}
                onDeselect={handleDeselect}
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
        >
            <View>
                <Octicons name="dot-fill" size={30} color="red" />
            </View>
        </Marker>
    )
}

export default Map;
