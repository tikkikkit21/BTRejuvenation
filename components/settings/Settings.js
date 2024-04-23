import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import { getDarkModeSetting, setDarkModeSetting } from '../../backend/userController';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);

    // fetch user setting
    useEffect(() => {
        async function getUserSetting() {
            const setting = await getDarkModeSetting();
            setDarkMode(setting);
        }

        getUserSetting();
    }, []);

    // handle switch toggled
    function toggleSwitch(props) {
        console.log("props:", props)
        setDarkMode(!darkMode);
        setDarkModeSetting(props);
    }

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
