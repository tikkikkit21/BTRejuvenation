import { View, Text, StyleSheet } from 'react-native';
import { Octicons, Fontisto, FontAwesome6, Entypo } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import Map from '../home/Map';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function Navigate() {
    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['35%', '50%', '70%', '95%'], []);

    // Checks if tab is focused on
    const isFocused = useIsFocused();

    // Ref for the BottomSheet component
    const bottomSheetRef = useRef(null);

    // Reset bottom sheet index to a fixed snap point whenever the component mounts
    useEffect(() => {
        // Checks if tab has been clicked on
        if (isFocused) {
            // Reset the BottomSheet to the desired snap point
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, [isFocused]);

    // Handles when the arrow-swap button is clicked
    function handleSwapDestinations() {
        console.log("Swap 'em!");
    }

    return (
        <View style={styles.container}>
          <MapViewMemo />
          <BottomSheet
              ref={bottomSheetRef}
              index={0} 
              snapPoints={snapPoints}
              backgroundStyle={{backgroundColor: '#FFFFFF'}}
          >
              <View style={styles.inputContainer}>
                <FontAwesome6 name='location-crosshairs' size={15} color='white'/>
                <BottomSheetTextInput style={styles.inputText} placeholder='Start Destination'/>
              </View>
              <View style={styles.swapButtonContainer}>
                <TouchableOpacity onPress={handleSwapDestinations}>
                    <Fontisto name="arrow-swap" size={22} style={styles.swapButton}/>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Entypo name='location' size={15} color='white'/>
                <BottomSheetTextInput style={styles.inputText} placeholder='End Destination  '/>
              </View>
          </BottomSheet>
        </View>
    );
}

// Memoized Map component to avoid unnecessary rerendering.
const MapViewMemo = React.memo(Map);

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white'
  },
  containerHeadline: {
      fontSize: 20,
      fontWeight: '600',
      padding: 20,
      color: 'white'
  },
  swapButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: 15
  },
  swapButton: {
      transform: [{ rotate: '90deg' }]
  },
  inputContainer: {
      flexDirection: 'row',
      backgroundColor: '#75787B',
      borderRadius: 10,
      width: '90%',
      paddingHorizontal: 10,
      alignItems: 'center',
      marginLeft: 20,
      color: 'white'
  },
  inputText: {
      marginTop: 5,
      marginHorizontal: 5,
      marginBottom: 5,
      paddingRight: 205,
      borderRadius: 10,
      fontSize: 16,
      padding: 5,
      backgroundColor: 'white',
      color: 'white'
  },
  suggestedRoutesContainer: {
      marginTop: 50,
      backgroundColor: '#A24857',
      paddingTop: 15,
      paddingBottom: 70
  },
  suggestedRoutesText: {
      fontSize: 20,
      fontWeight: '700',
      color: 'white',
      marginLeft: 5
  }
});
