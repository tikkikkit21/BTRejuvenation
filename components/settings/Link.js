import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

export default function Link({ text, url, icon }) {
    return (
        <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(url)}
        >
            <View style={styles.linkLabel}>
                <View style={styles.linkText}>
                    {icon}
                    <Text style={styles.buttonText}>{text}</Text>
                </View>
                <AntDesign name="right" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    linkButton: {
        padding: 5
    },
    linkLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    linkText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 10
    }
});
