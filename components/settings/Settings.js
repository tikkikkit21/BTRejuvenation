import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome6 } from '@expo/vector-icons';
import { getDarkModeSetting, setDarkModeSetting, getTrackingPermission, setTrackingPermission, clearUsageData, setRefreshFrequencySetting, getRefreshFrequencySetting } from '../../backend/userController';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [usageTracking, setUsageTracking] = useState(false);
    const [refreshFreq, setRefreshFreq] = useState(30);

    // fetch user settings from device storage
    useEffect(() => {
        async function getUserSettings() {
            setDarkMode(await getDarkModeSetting());
            setUsageTracking(await getTrackingPermission());
            setRefreshFreq(await getRefreshFrequencySetting());
        }

        getUserSettings();
    }, []);

    // handle dark mode switch toggled
    function toggleDarkMode(props) {
        setDarkMode(!darkMode);
        setDarkModeSetting(props);
    }

    // handle usage tracking switch toggled
    function toggleUsageTracking(props) {
        setUsageTracking(!usageTracking);
        setTrackingPermission(props);
    }

    // handle frequency slider change
    function handleSliderChange(freq) {
        setRefreshFreq(freq);
    }

    function finishSliderChange(freq) {
        setRefreshFrequencySetting(freq);
    }

    return (
        <View style={styles.container} >
            <Text style={styles.header}>General</Text>
            <View style={styles.section}>
                <View style={styles.inlineSetting}>
                    <Switch
                        trackColor={{ false: '#fff', true: '#000' }}
                        thumbColor={'#fff'}
                        onValueChange={toggleDarkMode}
                        onSlidingComplete={finishSliderChange}
                        value={darkMode}
                        style={styles.switch}
                    />
                    <Text>Toggle Dark Mode</Text>
                </View>
                <View style={styles.setting}>
                    <Text>Change bus refresh frequency: {refreshFreq}s</Text>
                    <Slider
                        style={styles.slider}
                        onValueChange={handleSliderChange}
                        value={refreshFreq}
                        minimumValue={10}
                        maximumValue={30}
                        step={5}
                        minimumTrackTintColor="#8F2647"
                    />
                </View>
            </View>
            <Text style={styles.header}>Data Usage</Text>
            <View style={styles.section}>
                <Text>BT app can track your app usage for smart route suggestions. Data is only stored locally in your device and can never be access by the BT company</Text>
                <View style={styles.inlineSetting}>
                    <Switch
                        trackColor={{ false: '#fff', true: '#000' }}
                        thumbColor={'#fff'}
                        onValueChange={toggleUsageTracking}
                        value={usageTracking}
                        style={styles.switch}
                    />
                    <Text>Enable Usage Tracking</Text>
                </View>
                <View style={styles.setting}>
                    <TouchableOpacity style={styles.button} onPress={clearUsageData}>
                        <View style={styles.buttonLabel}>
                            <FontAwesome6 name="trash" size={24} color="red" />
                            <Text style={styles.buttonText}>Delete saved usage data</Text>
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
        marginTop: 5,
        marginBottom: 5
    },
    setting: {
        margin: 5,
        margin: 5,
    },
    inlineSetting: {
        margin: 5,
        margin: 5,
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
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
        width: "auto",
        margin: 15
    },
    buttonText: {
        marginLeft: 10
    },
    buttonLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center"
    }
});
