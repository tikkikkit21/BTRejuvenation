import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import StopInfo from '../routes/StopInfo';

const Stack = createStackNavigator();

function HomeTab() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#000000'
            }}
            initialRouteName="Map"
        >
            <Stack.Screen name="Blacksburg Transit" component={Map} />
            <Stack.Screen name="StopInfo" component={StopInfo}/>
        </Stack.Navigator>
    );
}

export default HomeTab;
