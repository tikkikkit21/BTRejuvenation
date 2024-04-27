import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Ionicons, FontAwesome5, FontAwesome6, Foundation } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useSelector, useDispatch } from 'react-redux';

import HomeTab from './components/home/HomeTab';
import FavoritesTab from './components/favorites/FavoritesTab';
import RoutesTab from './components/routes/RoutesTab';
import NavigateTab from './components/navigate/NavigateTab';
import SettingsTab from './components/settings/SettingsTab';

import { getSuggestedRoute } from './backend/userController';
import { fetchDarkModeSetting } from './store/darkModeReducer';
import { fetchRefreshFrequencySetting } from './store/refreshFrequencyReducer';
import { fetchUsageTrackingSetting } from './store/usageTrackingReducer';

const Tab = createBottomTabNavigator();
const TEST_LOCATION = { time: new Date("2024-04-20T11:59:00"), coords: { lat: 37.22823553939222, long: -80.42348272720925 } };

export default function App() {
    const dispatch = useDispatch();

    const darkMode = useSelector(state => state.darkMode.isEnabled);

    // fetch suggestion
    useEffect(() => {
        async function fetchSuggestedRoute() {
            const suggestedRoute = await getSuggestedRoute(TEST_LOCATION);
            console.log("suggestedRoute:", suggestedRoute);

            if (suggestedRoute !== null) {
                // do something in frontend
                Alert.alert(
                    "Suggested Route",
                    suggestedRoute,
                )
            }
        }
        fetchSuggestedRoute();
    }, []);

    // load user settings from backend into Redux
    useEffect(() => {
        dispatch(fetchDarkModeSetting());
        dispatch(fetchRefreshFrequencySetting());
        dispatch(fetchUsageTrackingSetting());
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
                            case "SettingsTab":
                                icon = <FontAwesome6 name='gear' size={size} color={color} />
                                break;
                            default:
                                console.log("Unknown name:", route.name)
                                break;
                        }

                        return icon;
                    },
                    tabBarActiveTintColor: darkMode ? "#E5751F" : "#861F41",
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabel: getTabBarLabel(route.name), // Custom tab label
                    headerShown: false
                })}
            >
                <Tab.Screen name="HomeTab" component={HomeTab} />
                <Tab.Screen name="NavigateTab" component={NavigateTab} />
                <Tab.Screen name="RoutesTab" component={RoutesTab} />
                <Tab.Screen name="SettingsTab" component={SettingsTab} />
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
        case "SettingsTab":
            return "Settings";
        default:
            return routeName;
    }
}
