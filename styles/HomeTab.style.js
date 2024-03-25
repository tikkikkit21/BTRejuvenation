import { StyleSheet } from "react-native";

export default StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    refreshButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#A40046', // Color code
        padding: 15, // Increase button padding
    },
    feedbackButton: {
        position: 'absolute',
        top: 80,
        right: 10,
        backgroundColor: '#A40046', // Color code
        padding: 15, // Increase button padding
    }
});
