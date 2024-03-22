import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import appStyles from '../styles/App.style';
import styles from '../styles/HomeTab.style';
import { getAllBuses } from '../backend/busController';

function HomeTab() {
    const [buses, setBuses] = useState([]);

    async function getBuses() {
        const buses = await getAllBuses();
        setBuses(buses);
    }

    useEffect(() => {
        getBuses();
    }, []);

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
                {getMarkers(buses)}
            </MapView>
        </View>
    )
}

function getMarkers(buses) {
    return buses.map(busObj => {
        return (
            <Marker
                coordinate={{
                    latitude: busObj.Latitude,
                    longitude: busObj.Longitude
                }}
                title={busObj.RouteShortName}
                description={`Last stop: ${busObj.LastStopName}`}
            />
        )
    });
}

export default HomeTab;
