import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';

export default function QRScanner({ navigation }) {
    const isFocused = useIsFocused();
    const [permission, requestPermission] = useCameraPermissions();

    // ask for permission to use camera
    if (!permission || !permission.granted) {
        requestPermission();
    }

    // send scanned data back to feedback form
    function onQRScanned(result) {
        if (result.type === "org.iso.QRCode") {
            let qrData = {};
            if (typeof result.data === "string" && result.data.startsWith("{")) {
                try {
                    json = JSON.parse(result.data);
                    if (json.route && json.bus_id) {
                        qrData = json;
                    }
                } catch (_) { }
            }
            navigation.navigate("Feedback", { qrData: qrData });
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
