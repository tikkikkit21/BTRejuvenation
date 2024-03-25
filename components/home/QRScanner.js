import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';

export default function QRScanner({ navigation }) {
    const isFocused = useIsFocused();
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission || !permission.granted) {
        requestPermission();
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
                facing={'back'}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
                onBarcodeScanned={onQRScanned}
            />}
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
