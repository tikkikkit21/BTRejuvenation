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

    const [stopListItems, setStopListItems] = useState([]);
    const [favorites, setFavorites] = useState([]);

    
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);

    useEffect (() => {
        //setIsArray(Array.isArray(stops));

        

        async function fetchData(){

            favs = await getFavoriteStops();
            setFavorites(favs);

            storeRoutes = await getScheduledRoutes(stopCode);  
            setSingleRoutes(storeRoutes);


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

        fetchStopListItems();
        
        /**
         * 1. getRoutes for stop
         * 2. GetNextDeparturesForStop with trips = 5
         * 3. store those into a component
         */

    }, []);

    async function fetchStopListItems() {
        const items = await renderStopList();
        setStopListItems(items);
    }

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

    async function renderStopList() {
        // Fetch the necessary data before rendering the FlatList
        const stopListItems = await Promise.all(singleRoutes.map(async (item) => {
            const stopList = await stopListComponent(item.RouteName, stopCode, item.RouteColor, item.RouteShortName);
            return (
                <View style={styles.flatListItem}>
                    {stopList}
                </View>
            );
        }));
    
        return stopListItems;
    }
    
    return (
        <View>
            <MapViewMemo/>
            <Toast/>
            <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                    <Text>{`${singleStop.stopCode} - ${singleStop.StopName}`}</Text>
                    <TouchableOpacity style={{ marginRight: 15 }} onPress={() => onHeartPress(stopCode)}>
                        <FontAwesome6 name="heart" size={22} style={{ color: isFavorite(stopCode) ? 'red' : 'black' }} />
                    </TouchableOpacity>
                </View>
                <View>
                    {/* Render the stop list items */}
                    {stopListItems}
                </View>
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