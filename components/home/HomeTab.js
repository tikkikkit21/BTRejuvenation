import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import Alerts from './Alerts';

const Stack = createStackNavigator();

function HomeTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} />
            <Stack.Screen name="Alerts" component={Alerts} />
        </Stack.Navigator>
    );
}

export default HomeTab;
