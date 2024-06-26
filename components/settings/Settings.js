import React, { useState } from 'react';
import { Text, View, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { setDarkModeSetting, setTrackingPermission, clearUsageData, setRefreshFrequencySetting } from '../../backend/userController';
import Link from './Link';

import { useDispatch, useSelector } from 'react-redux';
import { updateDarkMode } from '../../store/darkModeReducer';
import { updateRefreshFrequency } from '../../store/refreshFrequencyReducer';
import { updateUsageTracking } from '../../store/usageTrackingReducer';



export default function Settings({ navigation }) {
    const dispatch = useDispatch();

    // Redux storage values
    const darkModeRedux = useSelector(state => state.darkMode.isEnabled);
    const styles = darkModeRedux ? dark : light;
    const refreshFreqRedux = useSelector(state => state.refreshFrequency.time);
    const usageTrackingRedux = useSelector(state => state.usageTracking.isEnabled);

    // state variables
    const [isDarkMode, setIsDarkMode] = useState(darkModeRedux);
    const [usageTracking, setUsageTracking] = useState(usageTrackingRedux);
    const [refreshFreq, setRefreshFreq] = useState(refreshFreqRedux);

    // handle dark mode switch toggled
    function toggleDarkMode(newDarkMode) {
        setIsDarkMode(!isDarkMode);
        setDarkModeSetting(newDarkMode);
        dispatch(updateDarkMode(newDarkMode));
    }

    // handle usage tracking switch toggled
    function toggleUsageTracking(newUsageTracking) {
        setUsageTracking(!usageTracking);
        setTrackingPermission(newUsageTracking);
        dispatch(updateUsageTracking(newUsageTracking));
    }

    // handle frequency slider change
    function handleSliderChange(newFreq) {
        setRefreshFreq(newFreq);
    }

    function finishSliderChange(newFreq) {
        setRefreshFrequencySetting(newFreq);
        dispatch(updateRefreshFrequency(newFreq));
    }

    function deleteData() {
        clearUsageData();
        Toast.show({
            type: "success",
            text1: "Data succesfully deleted",
            position: "top"
        });
    }

    return (<>
        <ScrollView>
            <View style={styles.container} >
                <Text style={styles.header}>General</Text>
                <View style={styles.section}>
                    <View style={styles.inlineSetting}>
                        <Switch
                            trackColor={{ false: '#fff', true: '#000' }}
                            thumbColor={'#fff'}
                            onValueChange={toggleDarkMode}
                            value={isDarkMode}
                            style={styles.switch}
                        />
                        <Text>Toggle Dark Mode</Text>
                    </View>
                    <View style={styles.setting}>
                        <Text>Change bus refresh frequency: {refreshFreq}s</Text>
                        <Slider
                            style={styles.slider}
                            onValueChange={handleSliderChange}
                            onSlidingComplete={finishSliderChange}
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
                        <TouchableOpacity
                            style={styles.button}
                            onPress={deleteData}
                        >
                            <View style={styles.buttonLabel}>
                                <FontAwesome6 name="trash" size={24} color="red" />
                                <Text style={styles.buttonText}>Delete saved usage data</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.header}>Feedback</Text>
                <View style={styles.section}>
                    <View style={styles.setting}>
                        <Text>Scan QR code on bus to access feedback form</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("QR Scanner")}>
                            <MaterialCommunityIcons name="qrcode-scan" size={75} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section}>
                    <Link
                        text="Service Calendar"
                        url="https://ridebt.org/service-calendar"
                        icon={<FontAwesome name="calendar" size={24} color="#8F2647" />}
                    />
                    <Link
                        text="BT Access"
                        url="https://ridebt.org/bt-access/overview"
                        icon={<FontAwesome5 name="wheelchair" size={24} color="#8F2647" />}
                    />
                    <Link
                        text="Contact Us"
                        url="https://ridebt.org/feedback"
                        icon={<MaterialIcons name="feedback" size={24} color="#8F2647" />}
                    />
                </View>
            </View>
        </ScrollView>
        <Toast />
    </>);
}

const light = StyleSheet.create({
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
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
        width: "auto",
        margin: 15,
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 10
    },
    buttonLabel: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const dark = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5751F',
        padding: 25
    },
    header: {
        fontSize: 20,
        color: '#861F41'
    },
    section: {
        marginTop: 5,
        marginBottom: 5,
        color: '#861F41'
    },
    setting: {
        margin: 5,
        margin: 5,
        color: '#861F41'
    },
    inlineSetting: {
        margin: 5,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    switch: {
        margin: 10,
        color: '#861F41'
    },
    small: {
        fontSize: 10,
        color: '#861F41'
    },
    button: {
        borderColor: "#861F41",
        backgroundColor: '#861F41',
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
        width: "auto",
        margin: 15,
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 10,
        color: 'white'
    },
    buttonLabel: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
