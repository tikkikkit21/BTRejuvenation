import { View, Text, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef } from 'react';
// import styles from '../../styles/App.style';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export default function PlanTrip() {
    const snapPoints = useMemo(() => ['12%','25%', '50%', '70%', '95%'], []);

    return (
        <View style={styles.container}>
            <BottomSheet 
                snapPoints={snapPoints}
                backgroundStyle={{backgroundColor: '#7F1237'}}
            >
                <View style={styles.inputContainer}>
                    <Octicons name='search' size={15} color='#000'/>
                    <BottomSheetTextInput style={styles.input} placeholder='Search for Bus Routes'/>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerHeadline : {
    fontSize: 20,
    fontWeight: '600',
    padding: 20,
    color: 'white',
  },
  inputContainer : {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 20,
  },
  input : {
    marginTop: 5,
    marginHorizontal: 5,
    marginBottom: 5,
    borderRadius: 10,
    fontSize: 16,
    padding: 5,
    backgroundColor: 'white',
    color: 'black',
  },
});