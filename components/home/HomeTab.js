import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import FeedbackForm from './FeedbackForm';

const Stack = createStackNavigator();

function HomeTab({ navigation }) {
    function goToFeedback() {
        navigation.navigate("Feedback");
    }

    return (
        <Stack.Navigator
            screenOptions={{
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} initialParams={{ handleFeedbackButtonClick: goToFeedback }} />
            <Stack.Screen name="Feedback" component={FeedbackForm} />
        </Stack.Navigator>
    );
}

export default HomeTab;
