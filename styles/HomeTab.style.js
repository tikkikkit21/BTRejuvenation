import { StyleSheet } from "react-native";

export default StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    buttonText: {
        backgroundColor: '#A40046', // Color code
        color: 'white',
        padding: 15, // Increase button padding
        fontSize: 18, // Increase font size
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
