import { React, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from '../settings/FeedbackForm';
import QRScanner from '../settings/QRScanner';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

function HomeTab({ mapRegion, setMapRegion, buses, setBuses, stops, setStops, route, setRoute, isOnCooldown, setIsOnCooldown }) {
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    // const styles = darkMode ? dark : light;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white"  },
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
        </Stack.Navigator>
    );
}

export default HomeTab;
