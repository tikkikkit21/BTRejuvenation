import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import Slider from '@react-native-community/slider';

export function FormTextInput({ question, placeholder, value, handleChangeText }) {
    return (
        <View style={styles.container}>
            <Text style={styles.question}>{question}</Text>
            <TextInput
                style={styles.answer}
                placeholder={placeholder}
                value={value}
                onChangeText={handleChangeText}
            />
        </View>
    );
}

export function FormSliderInput({ question, value, handleSliderChange }) {
    return (
        <View style={styles.section}>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={value}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#00FF00"
                    maximumTrackTintColor="#FF0000"
                />
                <Text style={styles.sliderValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 25,
    },
    buttonContainer: {
        width: 225,
        height: 50,
        borderWidth: 1, // Add border
        borderRadius: 15, // Add border radius for rounded corners
        padding: 5, // Add padding for space around the button
    },
    submitContainer: {
        width: 225,
        height: 50,
        borderWidth: 1, // Add border
        borderRadius: 15, // Add border radius for rounded corners
        padding: 5, // Add padding for space around the button
        margin: 40,
    },
    section: {
        justifyContent: 'center',
        padding: 5,
        margin: 5,
        marginTop: 15
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
    },
    question: {
        textAlign: 'left',  // Align questions on left side of screen
        fontSize: 18,
        marginBottom: 5,
    },
    answer: {
        width: 325,
        padding: 5,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5
    },
    slider: {
        width: 325,
        marginTop: 10,
    },
    sliderValue: {
        fontSize: 18,
        textAlign: 'center',
    },
});
