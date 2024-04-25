import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getScheduledRoutes } from '../../backend/routeController';
import Toast from 'react-native-toast-message';
import Map from './Map';
import { FontAwesome6 } from '@expo/vector-icons';

import { getNextDeparturesForStop } from '../../backend/stopController';
import BottomSheet from '@gorhom/bottom-sheet';
import { getFavoriteStops, deleteFavoriteStop, addFavoriteStop } from '../../backend/userController';


export default function StopInfo({ route }){
    let { stopName, stopCode, fromFavorites } = route.params;

    const [routes, setRoutes] = useState([]);
    const [singleRoutes, setSingleRoutes] = useState([]);
    const [singleStop, setSingleStop] = useState([]);

    const [update, setUpdate] = useState([]);
    

    const [favorites, setFavorites] = useState([]);

    
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);

    useEffect (() => {

        console.log("here");
        console.log(stopName);
        console.log(stopCode);
        console.log(fromFavorites);

        async function fetchData(){

            console.log("FETCHDATA")



            

            const storeRoutes = await getScheduledRoutes(stopCode, false); 
            setSingleRoutes(storeRoutes);

            const favs = await getFavoriteStops();
            setFavorites(favs);


            console.log(singleRoutes); 
            // if(fromFavorites){
            //     let stops = favorites;

            //     stops.forEach(async stop => {
            //         let routeLocal = await getScheduledRoutes(stop);
            //         storeRoutes.push(routeLocal);
            //     });
            //     console.log(storeRoutes);
            //     setRoutes(storeRoutes);
            // }

            // else{
            //     storeRoutes = await getScheduledRoutes(stopCode);  
            //     setSingleRoutes(storeRoutes);
            // }


            //routes has the informationL RouteName, RouteShortName, RouteColor

            //from routes, then use the GetNextDeparturesForStop(stop) trips = 5
            //then we will have RouteShortName, StopName, format(AdjustedDepartureTime)

        }
        fetchData();

        setUpdate([true]);

       

        /**
         * 1. getRoutes for stop
         * 2. GetNextDeparturesForStop with trips = 5
         * 3. store those into a component
         */

    }, []);

    useEffect (() =>{

        async function populateTimeString(){
            const promises = singleRoutes.map(async (item) => {
                const newTimeString = await getTimeString(stopCode, item.RouteShortName);
                item.TimeString = newTimeString;
            });
        
            await Promise.all(promises);
            setSingleRoutes([...singleRoutes]);
           }
        populateTimeString();

    }, [favorites])



    function isFavorite(stop) {
        if(favorites == null){
            return false;
        }
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

        setFavorites(await getFavoriteStops());

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

    async function getTimeString(stopCode2, routeShortName) {
        const times = await getNextDeparturesForStop(routeShortName, stopCode2);       
        if(!Array.isArray(times)){
            times = [times];
        }
        const timeString = times.map(time => formatTime(time.AdjustedDepartureTime)).join(', ');
        return timeString;
    }

    // Call renderStopList to get the stop list items
    //const stopListItems = await renderStopList();
    /**
     * IF THE CHAT GPT IMPLEMENTATION DOES NOT WORK, THEN GO BACKA ND USE THE AWAIT 
     * GETNEXTDEPARTURES FOR STOP JUST OUTSIDE OF THE ARRAY AND STORE IT AS A STATE VARIABLE
     * 
     */
    
    return (
        <View style = {styles.container}>
            <MapViewMemo/>
            <Toast/>
            <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 1 }}> 
                    <Text style={{ fontSize: 20, marginLeft: 15 }}>{`${stopCode} - ${stopName}`}</Text>
                    <TouchableOpacity style={{ marginRight: 25 }} onPress={() => onHeartPress(stopCode)}>
                        <FontAwesome6 name="heart" size={22} style={{ color: isFavorite(stopCode) ? 'red' : 'black' }} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data = {singleRoutes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <View style={styles.flatListItem}>
                            <View style={{ flexDirection: 'column', alignItems: 'left', marginLeft: 10, marginRight: 10 }}>
                                <Text style={{ fontSize: 17, color: '#' + item.RouteColor, textAlign: 'left' }}>{`${item.RouteName} (${item.RouteShortName})`}</Text>
                                <Text style={{ fontSize: 12, color: '#' + item.RouteColor}}>{item.TimeString}</Text>
                            </View>
                               
                        </View>
                    )}  
                />
                    
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