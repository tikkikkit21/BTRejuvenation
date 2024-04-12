import React from "react";

export function TextInput(question, placeholder, value, handleChangeText) {
    return (
        <View style={styles.container} key={index}>
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

export function SliderInput() {

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 5,
        margin: 5,
        marginTop: 15
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
    }
});
