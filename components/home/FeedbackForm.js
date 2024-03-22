import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

function FeedbackForm() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Feedback</Text>
            <TextInput placeholder="Placeholder text" style={styles.input} />
        </View>
    )
}

export default FeedbackForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        fontSize: 24
    },
    input: {
        padding: 5,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5
    }
});
