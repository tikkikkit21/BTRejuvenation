import React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import styles from '../styles/App.style';

function HomeTab() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.227613,
                    longitude: -80.422137,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0121,
                }}
            />
        </View>
    )
}

export default HomeTab;
