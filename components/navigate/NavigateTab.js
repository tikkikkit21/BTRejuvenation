import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navigate from './Navigate';

const Stack = createStackNavigator();

export default function NavigateTab(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Navigate"
        >
            <Stack.Screen name="Navigate">
                {(navigationProps) => (
                <Navigate
                    {...navigationProps}
                    mapRegion={props.mapRegion}
                    setMapRegion={props.setMapRegion}
                    buses={props.buses}
                    setBuses={props.setBuses}
                    stops={props.stops}
                    setStops={props.setStops}
                    route={props.route}
                    setRoute={props.setRoute}
                    isOnCooldown={props.isOnCooldown}
                    setIsOnCooldown={props.setIsOnCooldown}
                />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
