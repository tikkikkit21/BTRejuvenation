import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Alerts from './Alerts';

const Stack = createStackNavigator();

export default function AlertsTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7F1237' },
                headerTintColor: 'white'
            }}
            initialRouteName="Alerts"
        >
            <Stack.Screen name="Alerts" component={Alerts} />
        </Stack.Navigator>
    );
}
