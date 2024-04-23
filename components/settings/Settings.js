import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import { getDarkModeSetting, setDarkModeSetting, getTrackingPermission, setTrackingPermission } from '../../backend/userController';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [usageTracking, setUsageTracking] = useState(false);

    // fetch user setting for dark mode
    useEffect(() => {
        async function getUserSetting() {
            const setting = await getDarkModeSetting();
            setDarkMode(setting);
        }

        getUserSetting();
    }, []);

    // handle dark mode switch toggled
    function toggleDarkMode(props) {
        setDarkMode(!darkMode);
        setDarkModeSetting(props);
    }

    // fetch user setting for usage tracking
    useEffect(() => {
        async function getUserSetting() {
            const setting = await getTrackingPermission();
            setUsageTracking(setting);
        }

        getUserSetting();
    }, []);

    // handle usage tracking switch toggled
    function toggleUsageTracking(props) {
        setUsageTracking(!usageTracking);
        setTrackingPermission(props);
    }

    return (
        <View style={styles.container} >
            <View style={styles.setting}>
                <Switch
                    trackColor={{ false: '#fff', true: '#000' }}
                    thumbColor={'#fff'}
                    onValueChange={toggleDarkMode}
                    value={darkMode}
                    style={styles.switch}
                />
                <Text>Toggle Dark Mode</Text>
            </View>
            <View style={styles.setting}>
                <Switch
                    trackColor={{ false: '#fff', true: '#000' }}
                    thumbColor={'#fff'}
                    onValueChange={toggleUsageTracking}
                    value={usageTracking}
                    style={styles.switch}
                />
                <Text>Toggle Usage Tracking*</Text>
            </View>
            <View>
                <Text style={styles.small}>*BT app can track your app usage for smart route suggestions</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 25
    },
    setting: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    switch: {
        margin: 10
    },
    small: {
        fontSize: 10
    }
});
