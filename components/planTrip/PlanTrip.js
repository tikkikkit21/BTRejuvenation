import { View, Text, StyleSheet} from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
// import styles from '../../styles/App.style';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function PlanTrip() {
    const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

    return (
        <View style={styles.container}>
            <BottomSheet snapPoints={snapPoints}>
                <View>
                    <Text>This is the Plan a Trip Tab</Text>
                </View>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});