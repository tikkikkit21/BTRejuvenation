import React, { useEffect } from 'react';

import { Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './components/home/HomeTab';
import FavoritesTab from './components/favorites/FavoritesTab';
import RoutesTab from './components/routes/RoutesTab';
import NavigateTab from './components/navigate/NavigateTab';

import { getSuggestedRoute } from './backend/userController';

const Tab = createBottomTabNavigator();
const TEST_LOCATION = { time: new Date("2024-04-20T11:59:00"), coords: { lat: 37.22823553939222, long: -80.42348272720925 } };

export default function App() {
    // fetch suggestion
    async function fetchSuggestedRoute() {
        const suggestedRoute = await getSuggestedRoute(TEST_LOCATION);
        console.log("suggestedRoute:", suggestedRoute);

        if (suggestedRoute !== null) {
            // do something in frontend
        }
    }

    useEffect(() => {
        fetchSuggestedRoute();
    }, []);

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
                            case "NavigateTab":
                                icon = <FontAwesome5 name='map-marked-alt' size={size} color={color} />
                                break;
                            case "FavoritesTab":
                                icon = <Foundation name='heart' size={size} color={color} />
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
                    tabBarActiveTintColor: '#861F41',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabel: getTabBarLabel(route.name), // Custom tab label
                    headerShown: false
                })}
            >
                <Tab.Screen name="HomeTab" component={HomeTab} />
                <Tab.Screen name="NavigateTab" component={NavigateTab} />
                <Tab.Screen name="RoutesTab" component={RoutesTab} />
                <Tab.Screen name="FavoritesTab" component={FavoritesTab} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

// Function to get custom tab label based on screen name
function getTabBarLabel(routeName) {
    switch (routeName) {
        case "HomeTab":
            return "Home";
        case "FavoritesTab":
            return "Favorites";
        case "NavigateTab":
            return "Navigate";
        case "RoutesTab":
            return "Routes";
        default:
            return routeName;
    }
}
