import React from 'react';
import { Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons';
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
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let icon;

                        switch (route.name) {
                            case "Home":
                                icon = <Ionicons name='map' size={size} color={color} />
                                break;
                            case "Alerts":
                                icon = <Foundation name='alert' size={size} color={color} />
                                break;
                            case "Plan a Trip":
                                icon = <FontAwesome5 name='map-marked-alt' size={size} color={color} />
                                break;
                            case "Routes":
                                icon = <FontAwesome5 name='route' size={size} color={color} />
                                break;

                            default:
                                console.log("Unknown name:", route.name)
                                break;
                        }

                        return icon;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Home" component={HomeTab} />
                <Tab.Screen name="Alerts" component={AlertsTab} />
                <Tab.Screen name="Plan a Trip" component={PlanTrip} />
                <Tab.Screen name="Routes" component={RoutesTab} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
