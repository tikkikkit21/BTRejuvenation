import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './components/HomeTab';
import AlertsTab from './components/AlertsTab';
import PlanTrip from './components/PlanTrip';
import RoutesTab from './components/RoutesTab';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeTab} />
                <Tab.Screen name="Alerts" component={AlertsTab} />
                <Tab.Screen name="Plan a Trip" component={PlanTrip} />
                <Tab.Screen name="Routes" component={RoutesTab} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
