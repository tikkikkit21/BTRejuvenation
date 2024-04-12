import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Fontisto, FontAwesome6, Entypo, Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
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

    // States to maintain destination values
    const [startDestination, setStartDestination] = useState('');
    const [endDestination, setEndDestination] = useState('');

    // State to determine when to display more options
    const [showMoreOptions, setShowMoreOptions] = useState(false);


    // Reset bottom sheet index to a fixed snap point whenever the component mounts
    useEffect(() => {
        // Checks if tab has been clicked on
        if (isFocused) {
            // Reset the BottomSheet to the desired snap point
            bottomSheetRef.current?.snapToIndex(0);
            // Reset destinations
            setStartDestination('');
            setEndDestination('');
        }
    }, [isFocused]);

    // Handles when the arrow-swap button is clicked
    const handleSwapDestinations = () => {
        // Swap out the destination values
        temp_start = startDestination;
        setStartDestination(endDestination);
        setEndDestination(temp_start);
    }

    // Handles when 'More Options' is clicked
    const handleMoreOptions = () => {
        setShowMoreOptions(!showMoreOptions);
        
        // Extend or reduce screen if more options displayed
        if (!showMoreOptions) {
            bottomSheetRef.current?.snapToIndex(1); // Extend
        } else {
            bottomSheetRef.current?.snapToIndex(0); // Reduce
        }
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
                <View style={styles.textInputContainer}>
                    <BottomSheetTextInput
                        style={styles.textInput}
                        placeholder='Start Destination'
                        value={startDestination}
                        onChangeText={setStartDestination} // Updates the startDestination
                    />
                </View>
              </View>
              <View style={styles.swapButtonContainer}>
                <TouchableOpacity onPress={handleSwapDestinations}>
                    <Fontisto name="arrow-swap" size={22} style={styles.swapButton}/>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Entypo name='location' size={15} color='white'/>
                <View style={styles.textInputContainer}>
                    <BottomSheetTextInput
                        style={styles.textInput}
                        placeholder='End Destination  '
                        value={endDestination}
                        onChangeText={setEndDestination} // Updates the endDestination
                    />
                </View>
              </View>
              <View style={styles.moreButtonContainer}>
                <TouchableOpacity onPress={handleMoreOptions}>
                    <Text style={styles.moreButtonText}>More Options</Text>
                </TouchableOpacity>
              </View>
              {showMoreOptions && (
                <View>
                    <View style={styles.whenInputContainer}>
                        <Ionicons name="time-outline" size={15} color='white'/>
                        <View style={styles.textInputContainer}>
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder='When'
                            />
                        </View>
                    </View>
                    <View style={styles.priorityInputContainer}>
                        <MaterialCommunityIcons name="priority-high" size={15} color='white'/>
                        <View style={styles.textInputContainer}>
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder='Priority'
                            />
                        </View>
                    </View>
                </View>
              )
              }
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
      alignItems: 'center',
      borderRadius: 10,
      width: '90%',
      marginLeft: 20,
      padding: 10,
      paddingHorizontal: 10,
      backgroundColor: '#75787B',
      color: 'white'
  },
  textInputContainer: {
      flex: 1,
      marginLeft: 5,
      height: 30
  },
  textInput: {
      flex: 1,
      padding: 5,
      fontSize: 16,
      color: 'black',
      backgroundColor: 'white',
      borderRadius: 10
  },
  moreButtonContainer: {
      backgroundColor: 'white',
      padding: 20,
      paddingLeft: 25
  },
  moreButtonText: {
    color: 'blue',
    fontSize: 16
  },
  whenInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: '90%',
    marginLeft: 20,
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: '#75787B',
    color: 'white',
    marginBottom: 10 // Add margin bottom to create space
  },
  priorityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: '90%',
    marginLeft: 20,
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: '#75787B',
    color: 'white',
    marginBottom: 10 // Add margin bottom to create space
  }
});
