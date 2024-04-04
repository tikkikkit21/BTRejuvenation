import React from 'react';

import { Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './components/home/HomeTab';
import AlertsTab from './components/alerts/AlertsTab';
import PlanTrip from './components/planTrip/PlanTripTab';
import RoutesTab from './components/routes/RoutesTab';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let icon;

                        switch (route.name) {
                            case "HomeTab":
                                icon = <Ionicons name='map' size={size} color={color} />
                                break;
                            case "AlertsTab":
                                icon = <Foundation name='alert' size={size} color={color} />
                                break;
                            case "PlanTripTab":
                                icon = <FontAwesome5 name='map-marked-alt' size={size} color={color} />
                                break;
                            case "RoutesTab":
                                icon = <FontAwesome5 name='route' size={size} color={color} />
                                break;

                            default:
                                console.log("Unknown name:", route.name)
                                break;
                        }

                        return icon;
                    },
                    tabBarActiveTintColor: '#7F1237',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabel: getTabBarLabel(route.name), // Custom tab label
                    headerShown: false
                })}
            >
                <Tab.Screen name="HomeTab" component={HomeTab} />
                <Tab.Screen name="AlertsTab" component={AlertsTab} />
                <Tab.Screen name="PlanTripTab" component={PlanTrip} />
                <Tab.Screen name="RoutesTab" component={RoutesTab} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

// Function to get custom tab label based on screen name
function getTabBarLabel(routeName) {
    switch (routeName) {
        case "HomeTab":
            return "Home";
        case "AlertsTab":
            return "Alerts";
        case "PlanTripTab":
            return "Plan a Trip";
        case "RoutesTab":
            return "Routes";
        default:
            return routeName;
    }
}
