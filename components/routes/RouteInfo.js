
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import MapView, { MapCallout, Marker } from 'react-native-maps';
import Map, { createMarkers, createRoute, createStops } from '../home/Map';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Fontisto, FontAwesome6, Entypo, Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
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

import { getRouteTrafficPattern, getStops } from '../../backend/stopController';
import { getBus } from '../../backend/busController';
import { getNextTrip } from '../../backend/routeController';
import Toast from 'react-native-toast-message';

//const MapViewMemo = React.memo(Map);
//const MapViewMemo = React.memo(Map);
export default function RouteInfo({ route }) {
    let { routeShortName, routeName, routeColor } = route.params;
    const [trip, setTrips] = useState([]);
    const [stops, setStops] = useState([]);
    const [busses, setBusses] = useState([]);
    const [mapRoute, setMapRoute] = useState([]);

    const [toastMessage, setToastMessage] = useState([]);

    const darkMode = useSelector(state => state.darkMode.isEnabled);
    const styles = darkMode ? dark : light;
    /**
     * map state variables below
     */
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.227468937500895,
        longitude: -80.42357646125542,
        latitudeDelta: 0.051202637986392574,
        longitudeDelta: 0.03720943536600885,
    })
    Location.requestForegroundPermissionsAsync();
    
    const bottomSheetRef = useRef(null);

    useEffect (() => {
        bottomSheetRef.current?.snapToIndex(0);
        /**
         * HXP glitch because it can have 2 names
         */
        if(routeName == "Hokie Express"){
            routeShortName = "HXP";
        }
        else if(routeName == "Hethwood"){
            routeShortName = "HWD";
        }

       

        async function fetchInfo(){
            const bussesInfo = await getBus(routeShortName);
            setBusses(bussesInfo);

            const stops = await getStops(routeShortName);
            setStops(stops);

            const nextTrip = await getNextTrip(routeShortName);
            setTrips(nextTrip);

            setMapRoute(createRoute(stops, routeColor));
        }
        fetchInfo();


        const trafficDelay = getRouteTrafficPattern(routeShortName);
        if(trafficDelay > 0){
           
            Toast.show({
                type: "success",
                text1: `Expect up to a ${trafficDelay} minute delay for ${routeShortName}.`,
                position: "top"
            })
        }
        else{   
            Toast.show({
                type: "success",
                text1: `${routeShortName} is running on time.`,
                position: "top"
            })
        }

    }, []);

    useEffect(() => {

        if (busses.length > 0 && busses.Longitude != undefined && busses.Latitude != undefined && busses != undefined) {
            setMapRegion({
                latitude: busses.Latitude, 
                longitude: busses.Longitude, 
                latitudeDelta: 0.051202637986392574,
                longitudeDelta: 0.03720943536600885,
            });
        }
    }, [busses]);

     function formatTime(timeString) {
        const date = new Date(timeString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 == 12 am
        const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = hours + ':' + paddedMinutes + ' ' + ampm;
        
        return formattedTime;
    }
     // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);
    
    return (

        <View style={styles.container}>
           <MapView
                style={styles.map}
                region={mapRegion}
                onRegionChangeComplete={(region) => setMapRegion(region)}
                showsUserLocation={true}
            >
                {createMarkers([busses], null, routeColor)}
                {createStops(stops, routeColor)}
                {mapRoute}
            </MapView>
            <Toast/>
          <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={styles.bottomSheet}
                // backgroundStyle={{ backgroundColor: '#FFFFFF' }}
                ref={bottomSheetRef}
            >
                {/* Not gonna lie, below background color is from chat gpt, 
                i used it to make the background color slightly more light
                so that the text is easier to read */}
                <View style={[styles.busInfoContainer, { backgroundColor: `rgba(${parseInt(routeColor.slice(0,2), 16)},${parseInt(routeColor.slice(2,4), 16)},${parseInt(routeColor.slice(4,6), 16)}, 0.8)` }]}>
                    <Text style={{ fontSize: 22, color: '#000000', textAlign: 'center' }}>{`${routeShortName} Bus #${busses.AgencyVehicleName}`}</Text>
                    <Text style={{ fontSize: 15, color: '#000000', textAlign: 'center' }}>{`Last Stop: ${busses.LastStopName} (#${busses.StopCode})`}</Text>
                    <Text style={{ fontSize: 15, color: '#000000', textAlign: 'center' }}>
                        {`Bus Capacity: ${busses.PercentOfCapacity !== undefined ? busses.PercentOfCapacity + '%' : busses.TotalCount + ' People'}`}
                    </Text>                    

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
}


const light = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: 'white'
    },
    bottomSheet: {
        backgroundColor: 'white'
    },
    busInfoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    flatListItem: {
        width: '100%',
        paddingLeft:2, 
        paddingTop:7,
        paddingRight: 2,
        paddingBottom:10,
        marginVertical: 0.02
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
  
  
});

const dark = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: '#861F41'
    },
    bottomSheet: {
        backgroundColor: 'gray'
    },
    busInfoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        backgroundColor: '#861F41'
    },
    flatListItem: {
        width: '100%',
        paddingLeft:2, 
        paddingTop:7,
        paddingRight: 2,
        paddingBottom:10,
        marginVertical: 0.02,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
  
  
});
// Memoized Map component to avoid unnecessary rerendering.
