import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoutesList from './RoutesList';
import RouteInfo from './RouteInfo';

const Stack = createStackNavigator();

export default function RoutestTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Routes"
        >
            <Stack.Screen name="Routes" component={RoutesList} />
            <Stack.Screen name="RouteInfo" component={RouteInfo} />
        </Stack.Navigator>
    );
}
