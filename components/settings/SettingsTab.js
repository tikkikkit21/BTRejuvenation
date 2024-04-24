import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
import FeedbackForm from './FeedbackForm';
import QRScanner from './QRScanner';

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
            <Stack.Screen name="Feedback" component={FeedbackForm} />
            <Stack.Screen name="QR Scanner" component={QRScanner} />
        </Stack.Navigator>
    );
}
