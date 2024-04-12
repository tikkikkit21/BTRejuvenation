import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { FormTextInput } from './FormComponents';
import { submitFeedback } from '../../backend/feedbackController';

function FeedbackForm({ route, navigation }) {
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

    // convert questions into Views
    function getQuestions() {
        const questions = [
            { question: "Full Name", defaultText: "Enter your full name" },
            { question: "Rate your travel experience", defaultValue: sliderValue },
            { question: "Comments", defaultText: "Enter in any additional comments" },
        ];

        return questions.map((item, index) => {
            if (item.question === "Rate your travel experience") {
                return (
                    <View style={styles.section} key={index}>
                        <Text style={styles.question}>{item.question}</Text>
                        <SliderQuestion sliderValue={sliderValue} setSliderValue={setSliderValue} />
                    </View>
                );
            } else {
                return (
                    <View style={styles.section} key={index}>
                        <Text style={styles.question}>{item.question}</Text>
                        <TextInput
                            style={styles.answer}
                            placeholder={item.defaultText}
                            value={item.question === "Full Name" ? fullName : comments}
                            onChangeText={text => item.question === "Full Name" ? setFullName(text) : setComments(text)}
                        />
                    </View>
                );
            }
        });
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
            <View style={styles.submitContainer}>
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
}

// Serves as a view to dynamically update the value of the Slider bar
function SliderQuestion({ sliderValue, setSliderValue }) {
    // Handle slider change
    const handleSliderChange = (value) => {
        setSliderValue(value);
    };

    // Return view of slider
    return (
        <View style={styles.sliderContainer}>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#00FF00"
                maximumTrackTintColor="#FF0000"
            />
            <Text style={styles.sliderValue}>{sliderValue}</Text>
        </View>
    );
}

export default FeedbackForm;

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
