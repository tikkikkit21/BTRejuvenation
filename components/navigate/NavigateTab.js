import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navigate from './Navigate';

const Stack = createStackNavigator();

export default function NavigateTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7F1237' },
                headerTintColor: 'white'
            }}
            initialRouteName="Navigate"
        >
            <Stack.Screen name="Navigate" component={Navigate} />
        </Stack.Navigator>
    );
}
