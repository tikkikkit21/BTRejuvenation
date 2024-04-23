import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoutesList from './RoutesList';
import RouteInfo from './RouteInfo';

const Stack = createStackNavigator();

export default function RoutestTab(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Routes"
        >
            <Stack.Screen name="Routes">
                {(routesProps) => (
                <RoutesList
                    {...routesProps}
                    mapRegion={props.mapRegion}
                    setMapRegion={props.setMapRegion}
                    buses={props.buses}
                    setBuses={props.setBuses}
                    busStops={props.stops}
                    setBusStops={props.setStops}
                    route={props.route}
                    setRoute={props.setRoute}
                    isOnCooldown={props.isOnCooldown}
                    setIsOnCooldown={props.setIsOnCooldown}
                />
                )}
            </Stack.Screen>
            <Stack.Screen name="RouteInfo" component={RouteInfo} />
        </Stack.Navigator>
    );
}
