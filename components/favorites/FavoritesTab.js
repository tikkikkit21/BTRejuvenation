import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Favorites from './Favorites';

const Stack = createStackNavigator();

export default function FavoritesTab(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7F1237' },
                headerTintColor: 'white'
            }}
            initialRouteName="Favorites"
        >
            <Stack.Screen name="Favorites">
                {(favoritesProps) => (
                    <Favorites {...favoritesProps} {...props} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
