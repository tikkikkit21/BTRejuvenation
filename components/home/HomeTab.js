import { React, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from '../settings/FeedbackForm';
import QRScanner from '../settings/QRScanner';
import StopInfo from '../routes/StopInfo';

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
            <Stack.Screen name="StopInfo" component={StopInfo}/>
        </Stack.Navigator>
    );
}

export default HomeTab;
