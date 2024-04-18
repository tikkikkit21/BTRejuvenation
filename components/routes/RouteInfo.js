
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import Map from '../home/Map';
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

//const MapViewMemo = React.memo(Map);
export default function RouteInfo({ route }) {
    const { routeShortName, routeName, routeColor } = route.params;
    const [capacity, setCapacity] = useState("");
    const [trip, setTrips] = useState([]);
    //const [route, setRoute] = useState([]);
    const [lastStop, setLastStop] = useState([]);
    const [stops, setStops] = useState([]);
    const [busses, setBusses] = useState([]);
    
    const bottomSheetRef = useRef(null);

    useEffect (() => {
        bottomSheetRef.current?.snapToIndex(0);
        //console.log(navigation.getParam('routeShortName'))
        async function fetchInfo(){
            const bussesInfo = await getBus(routeShortName);
            //console.log('Route Short Name:', routeShortName);
            console.log('Busses Info:', bussesInfo);
            setBusses(bussesInfo);

            const stops = await getStops(routeShortName);
            setStops(stops);
        }
        fetchInfo();
        

        async function fetchAllTrips(){


        }

        fetchAllTrips();

        async function getBusFromRoute(){



        }
        getBusFromRoute();


    }, []);
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
                <FontAwesome6 name="bus-simple" size={20} color={'#' + routeColor} />

                <View style={[styles.routeContainer, { color: `#${routeColor}` }]}>
                    <Text style={styles.routeShortName}>{routeShortName}</Text>
                </View>
                <View style={[styles.routeContainer, { color: `#${routeColor}` }]}>
                    <Text style={styles.routeFullName}>{routeName}</Text>
                </View>


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
const MapViewMemo = React.memo(Map);

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: 'white'
    },
    routeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100, // Adjust the height as needed
    },
    routeShortName: {
        fontSize: 20
    },
    routeFullName: {
        fontSize: 20,
       
    },

});
// Memoized Map component to avoid unnecessary rerendering.
