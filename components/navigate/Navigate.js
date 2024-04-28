import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Fontisto, FontAwesome6, Entypo, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Map from '../home/Map';
import { getConnectedRoutes } from '../../backend/navigationController';
import { RouteOption } from './NavigateComponents';
import { getBusColor } from '../../backend/routeController';
import { useSelector } from 'react-redux';

const APIKEY = process.env.GOOGLE_MAPS_API_KEY;

export default function Navigate() {

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['30%', '60%', '70%', '95%'], []);

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

    // State to hold the route color
    const [routeColor, setRouteColor] = useState('white');

    // State to hold the route text color
    const [routeTextColor, setRouteTextColor] = useState('white');
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    const styles = darkMode ? dark : light;


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
        } else if (showMoreOptions && bottomSheetIndex == 1) {
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
            const busColor = await getBusColor(result[0].mainBusLine);
            console.log("HERE!");
            // If route is only Walking
            if (busColor === null) {
                setRouteColor('white');
                setRouteTextColor('white');
            } else { // if route contains a bus
                setRouteColor(busColor.RouteColor);
                setRouteTextColor(busColor.RouteTextColor);
                console.log("Check", busColor.RouteTextColor);
            }
        } catch (error) {
            console.log('Error Fetching Data:', error);
        }
    };

    // Handles when a RouteOption is pressed
    const handleRouteInfoClick = async (routeInfo) => {
        // Send props to RouteDirections
        navigation.navigate('RouteDirections', {
            routeData: routeInfo,
            routeColor: routeColor,
            routeTextColor: routeTextColor,
            startDestination: startDestination,
            endDestination: endDestination
        });
    };



    return (
        <View style={styles.container}>
            <MapViewMemo />
            <BottomSheet
                ref={bottomSheetRef}
                index={bottomSheetIndex}
                snapPoints={snapPoints}
                backgroundStyle={styles.bottomSheet}
                // backgroundStyle={{backgroundColor: '#FFFFFF'}}
                onChange={handleAnimateBottomSheet}
            >
                <View style={styles.inputContainer}>
                    <FontAwesome6 name='location-crosshairs' size={15} color='white' />
                    <View style={styles.textInputContainer}>
                        <GooglePlacesAutocomplete
                            placeholder="Start Destination"
                            value={startDestination}
                            textInputProps={{
                                onChangeText: (text) => { setStartDestination(text) }
                            }}
                            styles={{
                                container: {
                                    flex: 0,
                                },
                                textInput: {
                                    fontSize: 16,
                                    borderBottomWidth: 1, // Add a bottom border
                                    borderBottomColor: 'white', // Set the border color
                                },
                                powered: {
                                    display: 'none', // Hide the "powered by Google" attribution
                                },
                            }}
                            query={{
                                key: APIKEY,
                                language: "en",
                            }}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={200}
                        />
                    </View>
                </View>
                {/* Displays the Swap button */}
                <View style={styles.swapButtonContainer}>
                    <TouchableOpacity onPress={handleSwapDestinations}>
                        <Fontisto name="arrow-swap" size={22} style={styles.swapButton} />
                    </TouchableOpacity>
                </View>
                {/* Displays End Destination input */}
                <View style={styles.inputContainer}>
                    <Entypo name='location' size={15} color='white' />
                    <View style={styles.textInputContainer}>
                        <GooglePlacesAutocomplete
                            placeholder="End Destination"
                            value={endDestination}
                            textInputProps={{
                                onChangeText: (text) => { setEndDestination(text) }
                            }}
                            styles={{
                                container: {
                                    flex: 0,
                                },
                                textInput: {
                                    fontSize: 16,
                                    borderBottomWidth: 1, // Add a bottom border
                                    borderBottomColor: 'white', // Set the border color
                                },
                                powered: {
                                    display: 'none', // Hide the "powered by Google" attribution
                                },
                            }}
                            query={{
                                key: APIKEY,
                                language: "en",
                            }}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={200}
                        />
                    </View>
                </View>
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
                                    busLine={routeData[0].mainBusLine === 'N/A' ? 'Walk' : routeData[0].mainBusLine}
                                    tripDuration={routeData[0].totalDuration}
                                    tripDistance={routeData[0].totalDistance}
                                    routeColor={routeColor}
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

const light = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    bottomSheet: {
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
        flexDirection: 'column',
        flex: 1,
        marginLeft: 5,
        // height: 30
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

const dark = StyleSheet.create({
    container: {
        flex: 1,
        // color: '#861F41'
    },
    bottomSheet: {
        backgroundColor: '#861F41'
    },
    containerHeadline: {
        fontSize: 20,
        fontWeight: '600',
        padding: 20,
        color: '#861F41'
    },
    swapButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#861F41',
        padding: 15
    },
    swapButton: {
        transform: [{ rotate: '90deg' }],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        width: '90%',
        marginLeft: 20,
        padding: 10,
        paddingHorizontal: 10,
        backgroundColor: '#E5751F'
    },
    textInputContainer: {
        flex: 1,
        marginLeft: 5,
        height: 30,
        backgroundColor: '#E5751F'
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
        backgroundColor: '#861F41',
        padding: 20,
        paddingLeft: 25
    },
    moreButtonText: {
        color: '#E5751F',
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
        backgroundColor: '#E5751F',
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
        backgroundColor: '#E5751F',
        color: 'white',
        marginBottom: 10 // Add margin bottom to create space
    }
});


{/* <BottomSheetTextInput
                            style={styles.textInput}
                            placeholder='End Destination  '
                            value={endDestination}
                            onChangeText={setEndDestination} // Updates the endDestination
                        /> */}
