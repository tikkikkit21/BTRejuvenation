import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Fontisto, FontAwesome6, Entypo, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Map from '../home/Map';
import { getConnectedRoutes } from '../../backend/navigationController';
import { getBus } from '../../backend/busController';
import { RouteOption } from './NavigateComponents';

export default function Navigate() {

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['40%', '60%', '70%', '95%'], []);

    // Checks if tab is focused on
    const isFocused = useIsFocused();

    // To navigate to other views
    const navigation = useNavigation();

    // Ref for the BottomSheet component
    const bottomSheetRef = useRef(null);

    // States to monitor index of BottomSheet
    const [bottomSheetIndex, setBottomSheetIndex] = useState(0);

    // States to maintain destination values
    const [startDestination, setStartDestination] = useState('');
    const [endDestination, setEndDestination] = useState('');

    // State to determine when to display more options
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    // State to hold routes navigation data
    const [routeData, setRouteData] = useState(null);


    // Reset bottom sheet index to a fixed snap point whenever the component mounts
    useEffect(() => {
        // Checks if tab has been clicked on
        if (isFocused) {
            // Reset the BottomSheet to the desired snap point
            bottomSheetRef.current?.snapToIndex(0);
            setBottomSheetIndex(0);
            // Reset destinations
            setStartDestination('');
            setEndDestination('');
            setRouteData(null);
            // Resets show more options
            setShowMoreOptions(false);
        }
    }, [isFocused]);

    // When startDestination and/or endDestination are emptied, reset routeData
    useEffect(() => {
        // Reset routeData when startDestination or endDestination is cleared
        if (!startDestination || !endDestination) {
            setRouteData(null);
        }
    }, [startDestination, endDestination]);
    

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
        if (!showMoreOptions && bottomSheetIndex == 0) {
            bottomSheetRef.current?.snapToIndex(1); // Extend
            setBottomSheetIndex(1);
        }  else if (showMoreOptions && bottomSheetIndex == 1) {
            bottomSheetRef.current?.snapToIndex(0); // Reduce
            setBottomSheetIndex(0);
        }
    }

    // Event handler for BottomSheet animation
    const handleAnimateBottomSheet = (param) => {
        setBottomSheetIndex(param);
    };

    // Handles when 'search' button is clicked
    const handleRouteSearch = async () => {
        // Retrieve route data of the connected route for the trip
        try {
            const result = await getConnectedRoutes(startDestination, endDestination);
            setRouteData(result);
            // console.log('Results: ', routeData);
        } catch (error) {
            console.log('Error Fetching Data:', error);
        }
    };

    // Handles when a RouteOption is pressed
    const handleRouteInfoClick = async (routeInfo) => {
        // if (canTrackData) {
        //     const location = await Location.getCurrentPositionAsync({});
        //     await saveUsageDataRecord({
        //         route: shortName,
        //         coords:
        //         {
        //             lat: location.coords.latitude,
        //             long: location.coords.longitude
        //         },
        //         time: new Date()
        //     });
        // }

        navigation.navigate('RouteDirections', {
            routeData: routeInfo
        });
    };
    

    return (
        <View style={styles.container}>
          <MapViewMemo />
          <BottomSheet
              ref={bottomSheetRef}
              index={bottomSheetIndex}
              snapPoints={snapPoints}
              backgroundStyle={{backgroundColor: '#FFFFFF'}}
              onChange={handleAnimateBottomSheet}
          >
              <View style={styles.destinationContainer}>
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
            {/* Displays the Swap button */}
            <View style={styles.swapButtonContainer}>
                <TouchableOpacity onPress={handleSwapDestinations}>
                    <Fontisto name="arrow-swap" size={22} style={styles.swapButton}/>
                </TouchableOpacity>
            </View>
            {/* Displays End Destination input */}
            <View style={styles.destinationContainer}>
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
            {/* Displays the More Options button */}
            <View style={styles.moreButtonContainer}>
                <TouchableOpacity onPress={handleMoreOptions}>
                    <Text style={styles.moreButtonText}>More Options</Text>
                </TouchableOpacity>
            </View>
              {showMoreOptions && (     // Displays more options if button is clicked
                <View>
                    {/* Displays the When option */}
                    <View style={styles.moreOptionsContainer}>
                        <Ionicons name="time-outline" size={15} color='white'/>
                        <View style={styles.textInputContainer}>
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder='When'
                            />
                        </View>
                    </View>
                    {/* Displays the Priority option */}
                    <View style={styles.moreOptionsContainer}>
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
            {/* If destination fields are filled, show Search button */}
            {startDestination && endDestination && (
                <View>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleRouteSearch} // When pressed, calls function to retrieve connecting route
                        underlayColor='white'
                    >
                        <Text style={styles.searchText}>Search</Text>
                    </TouchableOpacity>
                    {routeData && (     // If routeData exists, display it
                        <View style={styles.routeOptionContainer}>
                            <RouteOption 
                                busLine={routeData[0].mainBusLine}
                                tripDuration={routeData[0].totalDuration}
                                tripDistance={routeData[0].totalDistance}
                                onPress={() => handleRouteInfoClick(routeData)}
                            />
                        </View>
                    )}
                </View>
            )}
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
    swapButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15
    },
    swapButton: {
        transform: [{ rotate: '90deg' }]
    },
    destinationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
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
        backgroundColor: '#A40046', // Background color
        paddingVertical: 10,
        paddingHorizontal: 20, // Adjust padding as needed
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    moreButtonText: {
        color: '#fff', // Font color
        fontSize: 16,
    },
    moreOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#75787B',
        color: 'white'
    },
    searchButton: {
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#A40046',
        borderRadius: 10,
        borderColor: '#fff'
    },
    searchText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
    },
    routeOptionContainer: {
        alignItems: 'center', // Center content horizontally
        justifyContent: 'center', // Center content vertically
    },
});
