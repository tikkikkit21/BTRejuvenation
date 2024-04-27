import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { getSuggestedRoute } from '../../backend/userController';
import Map from './Map';
import StopInfo from './StopInfo';
import RouteInfo from '../routes/RouteInfo';
import Alerts from './Alerts';
import { getCurrentRoutes, routeColorMap } from '../../backend/routeController';

const Stack = createStackNavigator();

function HomeTab() {
    const navigation = useNavigation();
    const darkMode = useSelector(state => state.darkMode.isEnabled);

    // suggested route alert
    useEffect(() => {
        async function fetchSuggestedRoute() {
            // figure out suggested route
            const location = await Location.getCurrentPositionAsync({});
            const data = {
                time: new Date(),
                coords: {
                    lat: location.coords.latitude,
                    long: location.coords.longitude
                }
            };
            const suggestedRoute = await getSuggestedRoute(data);

            // if there's a valid suggested route, alert on initial startups
            if (suggestedRoute) {
                const routes = await getCurrentRoutes();
                const routeInfo = routes.find(route => route.RouteShortName === suggestedRoute);
                if (routeInfo?.RouteName && routeInfo?.RouteColor) {
                    Alert.alert(
                        `Suggested Route: ${suggestedRoute}`,
                        "Would you like to view this route?",
                        [
                            {
                                text: "Sure",
                                onPress: () => {
                                    navigation.navigate(
                                        "RoutesTab",
                                        {
                                            screen: "RouteInfo",
                                            params: {
                                                routeShortName: suggestedRoute,
                                                routeName: routeInfo.RouteName,
                                                routeColor: routeInfo.RouteColor
                                            },
                                            initial: false
                                        }
                                    );
                                }
                            },
                            {
                                text: "No thanks"
                            }
                        ]
                    );
                }
            }
        }
        fetchSuggestedRoute();
    }, []);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white" },
                headerTintColor: '#000000'
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} />
            <Stack.Screen name="StopInfo" component={StopInfo} />
            <Stack.Screen name="RouteInfo" component={RouteInfo} />
            <Stack.Screen name="Alerts" component={Alerts} />
        </Stack.Navigator>
    );
}

export default HomeTab;
