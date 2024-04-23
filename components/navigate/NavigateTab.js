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
                    <Navigate {...navigationProps} {...props} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
