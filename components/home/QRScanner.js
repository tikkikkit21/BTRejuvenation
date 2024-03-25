import { Camera, CameraType } from 'expo-camera';

export default function QRScanner() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    if (!permission || !permission.granted) {
        requestPermission();
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <Camera style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                    <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
            </View>
        </Camera>
    )
}
