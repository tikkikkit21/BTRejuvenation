import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PlanTrip from './PlanTrip';

const Stack = createStackNavigator();

export default function PlanTripTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7F1237' },
                headerTintColor: 'white'
            }}
            initialRouteName="Plan a Trip"
        >
            <Stack.Screen name="Plan a Trip" component={PlanTrip} />
        </Stack.Navigator>
    );
}
