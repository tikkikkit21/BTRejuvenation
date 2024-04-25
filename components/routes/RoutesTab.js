import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoutesList from './RoutesList';
import RouteInfo from './RouteInfo';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

export default function RoutestTab(props) {
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    // const styles = darkMode ? dark : light;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white"  },
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
