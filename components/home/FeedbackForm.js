import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { FormTextInput, FormSliderInput } from './FormComponents';
import { submitFeedback } from '../../backend/feedbackController';

export default function FeedbackForm({ route, navigation }) {
    // Default Slider value
    const [sliderValue, setSliderValue] = useState(5);
    // State variables for behind-the-scenes data
    const [busID, setBusID] = useState("");
    // State variable for the route the user took
    const [routeName, setRouteName] = useState('');
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
            const form = {
                time: Date.now(),
                route: routeName,
                bus_id: busID,
                name: fullName,
                rating: sliderValue,
                comments: comments
            }
            submitFeedback(form);
            alert("Thanks for submitting your feedback!");
        }
    };

    // check if we have any data from QR scanner
    useEffect(() => {
        if (route?.params?.qrData) {
            data = route.params.qrData
            if (typeof data === "object" && data.route && data.bus_id) {
                setRouteName(data.route);
                setBusID(data.bus_id);
            }
        }
    }, [route]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Feedback Form</Text>
            <Text style={styles.question}>Scan QR Code on the Bus?</Text>
            <View style={styles.buttonContainer}>
                <Button title="Scan" onPress={() => navigation.navigate("QR Scanner")} />
            </View>
            <FormTextInput
                question={"Route Name"}
                placeholder={"What bus route did you take?"}
                value={routeName}
                handleChangeText={setRouteName}
            />
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
