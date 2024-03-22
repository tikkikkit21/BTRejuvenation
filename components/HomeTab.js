import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { getAllBuses } from '../backend/busController';
import { FontAwesome6 } from '@expo/vector-icons';

import appStyles from '../styles/App.style';
import styles from '../styles/HomeTab.style';

function HomeTab() {
    const [buses, setBuses] = useState([]);

    useEffect(() => {
        loadBuses();
        setInterval(loadBuses, 10000);
    }, []);

    async function loadBuses() {
        const buses = await getAllBuses();
        setBuses(buses);
    }

    const handleButtonClick = () => {
        // fetchData()
    }

    return (
        <View style={appStyles.container}>
            <TouchableOpacity onPress={handleButtonClick}>
                <Text style={localStyles.buttonText}>Button</Text>
            </TouchableOpacity>
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
                {getMarkers(buses)}
            </MapView>
        </View>
    );
}

function getMarkers(buses) {
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
            >
                <View>
                    <FontAwesome6 name="bus-simple" size={30} color="black" />
                </View>
            </Marker>
        )
    });
}

const localStyles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    buttonText: {
        backgroundColor: '#A40046', // Color code
        color: 'white',
        padding: 15, // Increase button padding
        fontSize: 18, // Increase font size
    },
});

export default HomeTab;
