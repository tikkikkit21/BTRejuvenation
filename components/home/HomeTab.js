import { React, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from '../settings/FeedbackForm';
import QRScanner from '../settings/QRScanner';

const Stack = createStackNavigator();

function HomeTab({ mapRegion, setMapRegion, buses, setBuses, stops, setStops, route, setRoute, isOnCooldown, setIsOnCooldown }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit">
                {(props) => (
                    <Map
                        {...props}
                        mapRegion={mapRegion}
                        setMapRegion={setMapRegion}
                        buses={buses}
                        setBuses={setBuses}
                        stops={stops}
                        setStops={setStops}
                        route={route}
                        setRoute={setRoute}
                        isOnCooldown={isOnCooldown}
                        setIsOnCooldown={setIsOnCooldown}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="Feedback" component={FeedbackForm} />
            <Stack.Screen name="QR Scanner" component={QRScanner} />
        </Stack.Navigator>
    );
}

export default HomeTab;
