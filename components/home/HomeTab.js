import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import StopInfo from './StopInfo';
import RouteInfo from '../routes/RouteInfo';
import FeedbackForm from '../settings/FeedbackForm';
import QRScanner from '../settings/QRScanner';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

function HomeTab({ mapRegion, setMapRegion, buses, setBuses, stops, setStops, route, setRoute, isOnCooldown, setIsOnCooldown }) {
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    // const styles = darkMode ? dark : light;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white"  },
                headerTintColor: '#000000'
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} />
            <Stack.Screen name="StopInfo" component={StopInfo}/>
            <Stack.Screen name="RouteInfo" component={RouteInfo}/>
            <Stack.Screen name="Alerts" component={Alerts} />
        </Stack.Navigator>
    );
}

export default HomeTab;
