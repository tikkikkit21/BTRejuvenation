import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';

export default function QRScanner({ navigation }) {
    const isFocused = useIsFocused();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission || !permission.granted) {
        requestPermission();
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function onQRScanned(result) {
        if (result.type === "org.iso.QRCode") {
            console.log("QR code scanned:", result.data);

            navigation.navigate("Feedback");
        }
    }

    return (
        <View style={styles.container}>
            {isFocused && <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
                onBarcodeScanned={onQRScanned}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
