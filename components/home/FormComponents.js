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
        <View style={styles.container}>
            <Text style={styles.question}>{question}</Text>
            <View style={sliderStyles.sliderContainer}>
                <Slider
                    style={sliderStyles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={value}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#00FF00"
                    maximumTrackTintColor="#FF0000"
                />
                <Text style={sliderStyles.sliderValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 10,
        width: '80%'
    },
    question: {
        textAlign: 'left',  // Align questions on left side of screen
        fontSize: 18,
        marginBottom: 5,
    },
    answer: {
        margin: 5,
        width: '95%',
        padding: 5,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5
    }
});

const sliderStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 5,
        margin: 10,
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
