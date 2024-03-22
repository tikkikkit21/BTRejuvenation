import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from './FeedbackForm';

const Stack = createStackNavigator();

function HomeTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="FeedbackForm" component={FeedbackForm} />
        </Stack.Navigator>
    );
}

export default HomeTab;
