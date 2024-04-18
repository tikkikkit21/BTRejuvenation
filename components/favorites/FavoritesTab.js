import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Favorites from './Favorites';

const Stack = createStackNavigator();

export default function FavoritesTab(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7F1237' },
                headerTintColor: 'white'
            }}
            initialRouteName="Favorites"
        >
            <Stack.Screen name="Favorites">
                {(favoritesProps) => (
                <Favorites
                    {...favoritesProps}
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
