import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navigate from './Navigate';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

export default function NavigateTab() {
    const darkMode = useSelector(state => state.darkMode.isEnabled);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white" },
                headerTintColor: '#000000'
            }}
            initialRouteName="Navigate"
        >
            <Stack.Screen name="Navigate" component={Navigate} />
        </Stack.Navigator>
    );
}
