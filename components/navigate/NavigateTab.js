import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navigate from './Navigate';

const Stack = createStackNavigator();

export default function NavigateTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Navigate"
        >
            <Stack.Screen name="Navigate" component={Navigate} />
        </Stack.Navigator>
    );
}