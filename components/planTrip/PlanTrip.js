import { View, Text, StyleSheet, Button } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef } from 'react';
// import styles from '../../styles/App.style';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Map from '../home/Map';

export default function PlanTrip() {
    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['12%','25%', '50%', '70%', '95%'], []);

    return (
        <View style={styles.container}>
          <Map style={styles.map}/>
          <BottomSheet 
              snapPoints={snapPoints}
              backgroundStyle={{backgroundColor: '#7F1237'}}
          >
              <View style={styles.inputContainer}>
                  <Octicons name='search' size={15} color='#000'/>
                  <BottomSheetTextInput style={styles.input} placeholder='Search for Destination'/>
              </View>
              <View style={[styles.inputContainer, styles.suggestedRoutesContainer]}>
                <Text style={styles.suggestedRoutesText}>Suggested Routes</Text>
              </View>
          </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  suggestedRoutesContainer :{
    marginTop: 50,
    backgroundColor: '#A24857',
    paddingTop: 15,
    paddingBottom: 70,
  },
  suggestedRoutesText : {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginLeft: 5,
  },
  map : {
    ...StyleSheet.absoluteFillObject,
  },
});