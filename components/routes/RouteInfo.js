
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import Map, { createMarkers, createRoute, createStops } from '../home/Map';
import { MaterialCommunityIcons, Fontisto, FontAwesome6, Entypo, Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
/**
 * make a call to get bus ->
 * or make a bus that gets passed in
 * add the bus as a parameter to the function
 * now, use the get Bus to get eht current bus information
 * store the capacity
 * store the last stop
 * and then 
 * get the next few trips for the bus and make a similar 
 * design to the one that grace had in mind\
 *
 * on the kapmside: plot the pointsand the map just how tikki did,
 * use the route color by passing it into the method
 * maybe package information to send
 */

import { getStops } from '../../backend/stopController';
import { getBus } from '../../backend/busController';
import { getNextTrip } from '../../backend/routeController';

const MapViewMemo = React.memo(Map);
//const MapViewMemo = React.memo(Map);
export default function RouteInfo({ route }) {
    const { routeShortName, routeName, routeColor } = route.params;
    const [trip, setTrips] = useState([]);
    const [stops, setStops] = useState([]);
    const [busses, setBusses] = useState([]);
    const [mapRoute, setMapRoute] = useState([]);
    
    const bottomSheetRef = useRef(null);

    useEffect (() => {
        bottomSheetRef.current?.snapToIndex(0);
        //console.log(navigation.getParam('routeShortName'))
        async function fetchInfo(){
            const bussesInfo = await getBus(routeShortName);
            //console.log('Route Short Name:', routeShortName);
           // console.log('Busses Info:', bussesInfo);
            setBusses(bussesInfo);

            const stops = await getStops(routeShortName);
            setStops(stops);

            const nextTrip = await getNextTrip(routeShortName);
            setTrips(nextTrip);

            createMarkers(busses, null);
            createStops(stops);
            setMapRoute(createRoute(stops));
        }
        fetchInfo();

    }, []);

    function formatTime(timeString) {
        const date = new Date(timeString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // "0" should be "12"

        const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = hours + ':' + paddedMinutes + ' ' + ampm;
        
        return formattedTime;
    }
     // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);
    
    return (

        <View style={styles.container}>
          <MapViewMemo />
          <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
                ref={bottomSheetRef}
            >
                {/* Not gonna lie, below background color is from chat gpt, 
                i used it to make the background color slightly more light
                so that the text is easier to read */}
                <View style={[styles.busInfoContainer, { backgroundColor: `rgba(${parseInt(routeColor.slice(0,2), 16)},${parseInt(routeColor.slice(2,4), 16)},${parseInt(routeColor.slice(4,6), 16)}, 0.8)` }]}>
                    <Text style={{ fontSize: 22, color: '#000000', textAlign: 'center' }}>{`${routeShortName} Bus #${busses.AgencyVehicleName}`}</Text>
                    <Text style={{ fontSize: 17, color: '#000000', textAlign: 'center' }}>{`Last Stop: ${busses.LastStopName} (#${busses.StopCode})`}</Text>
                    <Text style={{ fontSize: 17, color: '#000000', textAlign: 'center' }}>{`Bus Capacity: ${busses.PercentOfCapacity}%`}</Text>

                </View>

                <FlatList
                    data={trip}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.flatListItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 2, marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ fontSize: 15, color: '#' + routeColor, textAlign: 'left', fontWeight: 'bold' }}>{`${item.StopName} (#${item.StopCode})`}</Text>
                                    </View>
                                </View>
                                    <Text style={{ fontSize: 15, color: '#' + routeColor }}>{formatTime(item.CalculatedDepartureTime)}</Text>
                            </View>
                        </View>
                    )}
                />
            </BottomSheet>
        </View>
    );


  
    /**
     * need a function to plot the route, highlight the route
     * similar to that of before
     */


    /**
     * make a useeffect to store the routes trips
     * 
     */

    /**
     * useEffect for bus information:
     * capacity
     * color
     * last stop
     */

    /**
     * have a slider for 2 busses
     * bus 1: information
     * bus 2: information
     * 
     * or a dropdown for which bus info they would like to see
     * 
     * Upcoming Route (1):
     * 
     * Upcoming Route (2);
     */
}


const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: 'white'
    },
    busInfoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70, // Adjust the height as needed
    },
    flatListItem: {
        width: '100%',
        paddingLeft:2, 
        paddingTop:7,
        paddingRight: 2,
        paddingBottom:10,
        marginVertical: 0.02
    },
  
  
});
// Memoized Map component to avoid unnecessary rerendering.
