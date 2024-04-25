import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getScheduledRoutes } from '../../backend/routeController';
import Toast from 'react-native-toast-message';
import Map from '../home/Map';
import { FontAwesome6 } from '@expo/vector-icons';

import { getNextDeparturesForStop } from '../../backend/stopController';
import BottomSheet from '@gorhom/bottom-sheet';
import { getFavoriteStops, deleteFavoriteStop, addFavoriteStop } from '../../backend/userController';


export default function StopInfo({ route }){
    let { stopName, stopCode, fromFavorites } = route.params;

    const [routes, setRoutes] = useState([]);
    const [singleRoutes, setSingleRoutes] = useState([]);
    const [singleStop, setSingleStop] = useState([]);
    //const [isArray, setIsArray] = useState(false);

    const [favorites, setFavorites] = useState(false);

    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);

    useEffect (() => {
        //setIsArray(Array.isArray(stops));

        

        async function fetchData(){

            favs = await getFavoriteStops();
            setFavorites(favs);


            let storeRoutes = [];
            if(fromFavorites){
                let stops = favorites;

                stops.forEach(async stop => {
                    let routeLocal = await getScheduledRoutes(stop);
                    storeRoutes.push(routeLocal);
                });
                console.log(storeRoutes);
                setRoutes(storeRoutes);
            }
            else{
                storeRoutes = await getScheduledRoutes(stopCode);  
                setSingleRoutes(storeRoutes);
            }


            //routes has the informationL RouteName, RouteShortName, RouteColor

            //from routes, then use the GetNextDeparturesForStop(stop) trips = 5
            //then we will have RouteShortName, StopName, format(AdjustedDepartureTime)


        }

        fetchData();
        
        /**
         * 1. getRoutes for stop
         * 2. GetNextDeparturesForStop with trips = 5
         * 3. store those into a component
         */

    }, []);

    function isFavorite(stop) {
        if (favorites.includes(stop) > 0) {
            return true;
        }
        return false;
    }

    async function onHeartPress(stop) {

        if (isFavorite(stop)) {
            await deleteFavoriteStop(stop);
            Toast.show({
                type: "success",
                text1: `${stop} removed from favorites`,
                position: "top"

            });
        } else {
            await addFavoriteStop(stop);
            Toast.show({
                type: "success",
                text1: `${stop} added to favorites`,
                position: "top"

            });
        }

    }

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

    async function stopListComponent(currStop, routeName, stopCode2, routeColor){
        /**
         * Harding Ave (HDG)
         * time1, time2, time3, time4, time5
         */
        let times = await getNextDeparturesForStop(currStop.RouteShortName, stopCode2);
        /**
         * returns: (times.RouteShortName, times.StopName, times.AdjustedDepartureTime) * 5
         * 
         */
        timesString = "";
        times.forEach(time => {
            timesString += `, ${formatTime(time.AdjustedDepartureTime)}`;
        });
        return (
            <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 22, color: '#' + routeColor }}>{`${routeName} (${currStop.RouteShortName})`}</Text>
                <Text style={{ fontSize: 19, color: '#' + routeColor }}>{`${timesString}`}</Text>
            </View>
        );
    }

    return (
        <View>

       
            <MapViewMemo
                    mapRegion={mapRegion}
                    setMapRegion={setMapRegion}
                    buses={buses}
                    setBuses={setBuses}
                    stops={busStops}
                    setStops={setBusStops}
                    route={route}
                    setRoute={setRoute}
                    isOnCooldown={isOnCooldown}
                    setIsOnCooldown={setIsOnCooldown}
                />
                <Toast/>
                <BottomSheet
                    snapPoints={snapPoints}
                    backgroundStyle={{ backgroundColor: '#FFFFFF' }}
                >
                     <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                        <Text>`${singleStop.stopCode} - ${singleStop.StopName}`</Text>
                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => onHeartPress(item.RouteShortName)}>
                            <FontAwesome6 name="heart" size={22} style={{ color: isFavorite(item.RouteShortName) ? 'red' : 'black' }} />
                        </TouchableOpacity>
                     </View>
                    <View>
                        {/* Make below in a function, for a flatlist to call upon */}
                        <FlatList
                            data = {singleRoutes}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.flatListItem}>
                                    {stopListComponent(stopName, item.RouteName, stopCode, item.RouteColor)}
                                </View>
                            )}
                        />
                    </View>

                                                {/* Harding Ave-HDG, then times underneath, repeat for each route */}

                    
                    

                </BottomSheet>


        </View>
            


    );


    
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: 'white'
    },
    flatListItem: {
        width: '100%',
        paddingLeft:2, 
        paddingTop:7,
        paddingRight: 2,
        paddingBottom:10,
        marginVertical: 0.02,
        borderBottomWidth: 1, 
        borderBottomColor: 'gray',
    },


})


const MapViewMemo = React.memo(Map);