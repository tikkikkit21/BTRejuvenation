import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from './FeedbackForm';
import QRScanner from './QRScanner';

const Stack = createStackNavigator();

function HomeTab({ navigation }) {
    function goToFeedback() {
        navigation.navigate("Feedback");
    }

    function goToQRScanner() {
        navigation.navigate("QR Scanner");
    }

    return (
        <Stack.Navigator
            screenOptions={{
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} initialParams={{ handleFeedbackButtonClick: goToFeedback }} />
            <Stack.Screen name="Feedback" component={FeedbackForm} initialParams={{ goToQRScanner: goToQRScanner }} />
            <Stack.Screen name="QR Scanner" component={QRScanner}/>
        </Stack.Navigator>
    );
}

export default HomeTab;
