import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
import FeedbackForm from './FeedbackForm';
import QRScanner from './QRScanner';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

export default function SettingsTab(props) {
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    // const styles = darkMode ? dark : light;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white"  },
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
