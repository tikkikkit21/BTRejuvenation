import React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import appStyles from '../styles/App.style';
import styles from '../styles/HomeTab.style';
import { getBus } from '../backend/busController';

function HomeTab() {
    getBus("HWD");
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
            />
        </View>
    )
}

export default HomeTab;
