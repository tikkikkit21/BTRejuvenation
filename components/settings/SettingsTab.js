import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';

const Stack = createStackNavigator();

export default function SettingsTab(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Settings"
        >
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    );
}
