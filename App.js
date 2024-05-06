import React, { useEffect } from 'react';
import { Ionicons, FontAwesome5, FontAwesome6, Foundation } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';

import HomeTab from './components/home/HomeTab';
import RoutesTab from './components/routes/RoutesTab';
import NavigateTab from './components/navigate/NavigateTab';
import SettingsTab from './components/settings/SettingsTab';

import { fetchDarkModeSetting } from './store/darkModeReducer';
import { fetchRefreshFrequencySetting } from './store/refreshFrequencyReducer';
import { fetchUsageTrackingSetting } from './store/usageTrackingReducer';

const Tab = createBottomTabNavigator();

export default function App() {
    const dispatch = useDispatch();
    const darkMode = useSelector(state => state.darkMode.isEnabled);

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
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: darkMode ? '#861F41' : 'white'
                    }
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
