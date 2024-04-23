import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { getDarkModeSetting, setDarkModeSetting, getTrackingPermission, setTrackingPermission, clearUsageData } from '../../backend/userController';

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
            <Text style={styles.header}>General</Text>
            <View style={styles.section}>
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
            </View>
            <Text style={styles.header}>Data Usage</Text>
            <View style={styles.section}>
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
                <Text>Delete saved usage data</Text>
                <View style={styles.setting}>
                    <TouchableOpacity onPress={clearUsageData}>
                        <View style={styles.button}>
                            <FontAwesome6 name="trash" size={24} color="red" />
                            <Text>Delete</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.header}>Links</Text>
            <View style={styles.section}>
                <Text>Link 1</Text>
                <Text>Link 2</Text>
                <Text>Link 3</Text>
                <Text>Link 4</Text>
            </View>
            <Text style={styles.header}>Feedback</Text>
            <View style={styles.section}>

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
    header: {
        fontSize: 20
    },
    section: {

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
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
        position: "absolute"
    }
});
