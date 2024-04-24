import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
import FeedbackForm from './FeedbackForm';
import QRScanner from './QRScanner';
import { useTheme } from './Themes'; // Import useTheme hook

const Stack = createStackNavigator();

export default function SettingsTab(props) {
    const { theme } = useTheme(); // Access the theme

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.headerFooter }, // Use theme color
                headerTintColor: theme.basicText // Use theme color
            }}
            initialRouteName="Settings"
        >
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Feedback" component={FeedbackForm} />
            <Stack.Screen name="QR Scanner" component={QRScanner} />
        </Stack.Navigator>
    );
}
