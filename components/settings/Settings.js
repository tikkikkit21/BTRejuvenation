import React, { useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const toggleSwitch = () => setDarkMode(previousState => !previousState);

    return (
        <View style={styles.container} >
            <Text >This is the settings page</Text>
            <View style={styles.setting}>
                <Switch
                    trackColor={{ false: '#fff', true: '#000' }}
                    thumbColor={'#fff'}
                    onValueChange={toggleSwitch}
                    value={darkMode}
                    style={styles.switch}
                />
                <Text>Toggle Dark Mode</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 25,
    },
    setting: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    switch: {
        margin: 10
    }
});
