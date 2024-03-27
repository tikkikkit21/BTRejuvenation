import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from './FeedbackForm';
import QRScanner from './QRScanner';

const Stack = createStackNavigator();

function HomeTab() {
    return (
        <Stack.Navigator
            screenOptions={{
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} />
            <Stack.Screen name="Feedback" component={FeedbackForm} />
            <Stack.Screen name="QR Scanner" component={QRScanner} />
        </Stack.Navigator>
    );
}

export default HomeTab;
