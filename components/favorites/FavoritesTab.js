import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Favorites from './Favorites';

const Stack = createStackNavigator();

export default function AlertsTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7F1237' },
                headerTintColor: 'white'
            }}
            initialRouteName="Favorites"
        >
            <Stack.Screen name="Favorites" component={Favorites} />
        </Stack.Navigator>
    );
}
