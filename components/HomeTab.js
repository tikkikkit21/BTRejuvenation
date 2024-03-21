import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import styles from '../styles/App.style';

let { height, width } = Dimensions.get('window')

function HomeTab() {
    return (
        <View style={styles.container}>
            {/* <Text>This is the Home Tab</Text> */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    )
}

export default HomeTab;
