import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoutesList from './RoutesList';
import RouteInfo from './RouteInfo';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

export default function RoutestTab(props) {
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    // const styles = darkMode ? dark : light;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white"  },
                headerTintColor: '#000000'
            }}
            initialRouteName="Routes"
        >
            <Stack.Screen name="Routes" component={RoutesList} />
            <Stack.Screen name="RouteInfo" component={RouteInfo} />
        </Stack.Navigator>
    );
}
