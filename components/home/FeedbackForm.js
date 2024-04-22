import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { FormTextInput, FormSliderInput } from './FormComponents';
import { submitFeedback } from '../../backend/feedbackController';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function FeedbackForm({ route, navigation }) {
    // State variables for sliders
    const [timeRating, setTimeRating] = useState(5);
    const [cleanRating, setCleanRating] = useState(5);
    const [overallRating, setOverallRating] = useState(5);
    // State variables for behind-the-scenes data
    const [busID, setBusID] = useState("");
    // State variables for form
    const [routeName, setRouteName] = useState('');
    const [comments, setComments] = useState('');
    const [fullName, setFullName] = useState('');
    const [contact, setContact] = useState('');

    // Handles when Submit is clicked
    const handleSubmit = () => {
        const form = {
            time: Date.now(),
            route: routeName,
            bus_id: busID,
            rating_time: timeRating,
            rating_clean: cleanRating,
            rating_overall: overallRating,
            comments: comments,
            name: fullName,
            contact: contact
        }
        submitFeedback(form);
        Toast.show({
            type: "success",
            text1: "Thank you for submitting your feedback!",
            position: "bottom"
        });
    };

    // check if we have any data from QR scanner
    useEffect(() => {
        if (route?.params?.qrData) {
            data = route.params.qrData
            if (typeof data === "object" && data.route && data.bus_id) {
                setRouteName(data.route);
                setBusID(data.bus_id);
            }
            else {
                Toast.show({
                    type: "error",
                    text1: "Invalid QR code was scanned",
                    position: "top"
                });
            }
        }
    }, [route]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Scan QR Code on the Bus</Text>
                <Text style={styles.description}>Scan QR Code on the Bus</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("QR Scanner")}>
                        <MaterialCommunityIcons name="qrcode-scan" size={75} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Feedback</Text>
                <FormTextInput
                    question={"Route Name"}
                    placeholder={"What bus route did you take?"}
                    value={routeName}
                    handleChangeText={setRouteName}
                />
                <FormSliderInput
                    question="Rate the bus' timeliness"
                    value={timeRating}
                    handleSliderChange={setTimeRating}
                />
                <FormSliderInput
                    question="Rate the bus' cleanliness and comfort"
                    value={cleanRating}
                    handleSliderChange={setCleanRating}
                />
                <FormSliderInput
                    question="Rate your overall travel experience"
                    value={overallRating}
                    handleSliderChange={setOverallRating}
                />
                <FormTextInput
                    question="Comments"
                    placeholder="Enter in any additional comments"
                    value={comments}
                    handleChangeText={setComments}
                />
                <Text style={styles.title}>Contact Info</Text>
                <Text style={styles.description}>Provide your contact info if you'd like to be entered into sweepstakes</Text>
                <FormTextInput
                    question={"Full Name"}
                    placeholder={"Enter your full name"}
                    value={fullName}
                    handleChangeText={setFullName}
                />
                <FormTextInput
                    question="Contact"
                    placeholder="Please provide your email or phone number"
                    value={contact}
                    handleChangeText={setContact}
                />
                <View style={styles.submitContainer}>
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </View>
            <Toast />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 25,
    },
    buttonContainer: {
        borderWidth: 1, // Add border
        borderRadius: 15, // Add border radius for rounded corners
        padding: 10, // Add padding for space around the button
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
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
        margin: 5
    },
    question: {
        textAlign: 'left',  // Align questions on left side of screen
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        width: 325,
        padding: 5,
        margin: 2,
        textAlign: 'center'
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
