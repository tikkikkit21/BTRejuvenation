import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

function FeedbackForm() {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feedback</Text>
            {getQuestions()}
        </View>
    )
}

function getQuestions() {
    const questions = [
        "Question 1?",
        "Question 2?",
        "Question 3?",
    ];

    return questions.map(question => {
        return (
            <View style={styles.section}>
                <Text style={styles.question}>{question}</Text>
                <TextInput style={styles.answer} placeholder="Placeholder text" />
            </View>
        );
    });
}

export default FeedbackForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    section: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        margin: 5,
        marginTop: 15
    },
    title: {
        fontSize: 24
    },
    question: {
        fontSize: 18
    },
    answer: {
        padding: 5,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5
    }
});
