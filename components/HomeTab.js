import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import appStyles from '../styles/App.style';
import styles from '../styles/HomeTab.style';

function HomeTab() {
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
                <Marker
                    coordinate={{
                        latitude: 37.22578,
                        longitude: -80.443656
                    }}
                    title="HWD"
                    description="Sample description"
                />
            </MapView>
        </View>
    )
}

export default HomeTab;
