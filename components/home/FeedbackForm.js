import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { FormTextInput, FormSliderInput } from './FormComponents';
import { submitFeedback } from '../../backend/feedbackController';

export default function FeedbackForm({ route, navigation }) {
    // Default Slider value
    const [sliderValue, setSliderValue] = useState(5);
    // State variable for fullName
    const [fullName, setFullName] = useState('');
    // State variable for comments
    const [comments, setComments] = useState('');

    // Handles when Submit is clicked
    const handleSubmit = () => {
        // Handle form submission here
        if (comments !== '' && fullName === '') {
            alert(`Missing full name!`);
        } else if (fullName === '') {
            alert(`Please fill in form first.`);
        } else {
            const form = `\n${fullName}\n${sliderValue}\n${comments}`;
            submitFeedback(form);
            alert(`Full Name: ${fullName}\nRating:${sliderValue}\nComments: ${comments}`);
        }
    };

    // check if we have any data from QR scanner
    if (route?.params?.qrData) {
        console.log("Data received:", route.params.qrData);
        console.log("Data type:", typeof route.params.qrData);
        if (
            typeof route.params.qrData === "object"
            && route.params.qrData.route
            && route.params.qrData.bus_id
        ) {
            console.log("valid")
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Feedback Form</Text>
            <Text style={styles.question}>Scan QR Code on the Bus?</Text>
            <View style={styles.buttonContainer}>
                <Button title="Scan" onPress={() => navigation.navigate("QR Scanner")} />
            </View>
            {/* {getQuestions()} */}
            <FormTextInput
                question={"Full Name"}
                placeholder={"Enter your full name"}
                value={fullName}
                handleChangeText={setFullName}
            />
            <FormSliderInput
                question="Rate your travel experience"
                value={sliderValue}
                handleSliderChange={setSliderValue}
            />
            <FormTextInput
                question="Comments"
                placeholder="Enter in any additional comments"
                value={comments}
                handleChangeText={setComments}
            />
            <View style={styles.submitContainer}>
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </ScrollView>
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
