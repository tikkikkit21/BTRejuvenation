import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navigate from './Navigate';
import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

export default function NavigateTab(props) {
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    // const styles = darkMode ? dark : light;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: darkMode ? "#861F41" : "white"  },
                headerTintColor: '#000000'
            }}
            initialRouteName="Navigate"
        >
            <Stack.Screen name="Navigate" component={Navigate} />
        </Stack.Navigator>
    );
}
