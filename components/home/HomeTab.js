import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Map from './Map';
import StopInfo from './StopInfo';
import RouteInfo from '../routes/RouteInfo';
import Alerts from './Alerts';

const Stack = createStackNavigator();

function HomeTab() {
    const darkMode = useSelector(state => state.darkMode.isEnabled);

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
