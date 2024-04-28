import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../../styles/Route.style';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome, FontAwesome6, MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { getAllStops, getCurrentRoutes, getScheduledRoutes, getRoutesByCode } from '../../backend/routeController';
import Map from '../home/Map';
import { addFavoriteRoute, addFavoriteStop, deleteFavoriteRoute, deleteFavoriteStop, getFavoriteRoutes, getFavoriteStops, saveFavoriteRoutes, saveFavoriteStops } from '../../backend/userController';
import { saveUsageDataRecord } from '../../backend/userController';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { favoriteStopsToRouteList } from '../../backend/stopController';

export default function RoutesList() {
    const navigation = useNavigation();

    // state variables
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedStop, selectStop] = useState("");
    const [placeHolder, setPlaceholder] = useState("Filter By Route");
    const [favorites, setFavorites] = useState([]);


    const [favoriteStops, setFavoriteStops] = useState([]);


    const [favStop, setFavStop] = useState("");
    // const [heartColor, setHeartColor] = useState('black');

    // redux variables
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    const canTrackData = useSelector(state => state.usageTracking.isEnabled);

    //TODO: Create a method that uses the favorites useState to check to see if 
    //there is a favorite for this user, instead of calling async every time

    // load in info from API
    useEffect(() => {
        async function fetchStops() {
            try {
                const stopLocal = await getAllStops();
                let updatedStops = [["FAVSTOP", "Favorite Stops"], ...stopLocal];
                updatedStops = [["FAVROUTE", "Favorite Routes"], ...updatedStops];
                updatedStops = [["", "All Routes"], ...updatedStops];
                setStops(updatedStops);
            } catch (error) {
                console.error('Error fetching stops:', error);
            }
        }

        async function fetchAllRoutes() {
            try {
                /**
                 * change to GetCurrentRoutes
                 */
                const routeLocal = await getCurrentRoutes();
                setRoutes(routeLocal);
            } catch (error) {
                console.error('Error fetching stops:', error);
            }
        }

        async function fetchFavorites() {
            const favs = await getFavoriteRoutes();
            setFavorites(favs);
        }

        async function fetchFavStops(){
            const favStops = await getFavoriteStops();
            //console.log("favorite stops");
            //console.log(favStops);
            setFavoriteStops(favStops);

        }



        async function fetchAll() {
            await fetchStops();
            await fetchAllRoutes();
            await fetchFavorites();
            await fetchFavStops();
        }

        fetchAll();
    }, []);


    // update backend when favorites list changes
    useEffect(() => {
        saveFavoriteRoutes(favorites);
    }, [favorites]);

    // useEffect(() => {
    //     setFavoriteStops(favoriteStops);
    //     //saveFavoriteStops(favoriteStops);
    // }, [favoriteStops]);

    // helper function to check if a route is favorited or not
    function isFavorite(route) {
        return (favorites.includes(route) || favoriteStops.includes(route));
    }

    // pressing heart favorites/unfavorites a route
    async function onHeartPress(route) {
        // remove favorite route
        if(favStop != "FAVSTOP"){
            if (isFavorite(route)) {
                await deleteFavoriteRoute(route);
                const newFavorites = [...favorites];
                const index = favorites.indexOf(route);
                if (index !== -1) {
                    newFavorites.splice(favorites.indexOf(route), 1);
                    setFavorites(newFavorites);
                    Toast.show({
                        type: "success",
                        text1: `${route} removed from favorites`,
                        position: "top"
                    });
                }
            }
    
            // add favorite route
            else {
                await addFavoriteRoute(route);
                Toast.show({
                    type: "success",
                    text1: `${route} added to favorites`,
                    position: "top"
    
                });
    
                const newFavorites = [...favorites];
                newFavorites.push(route);
                setFavorites(newFavorites);
            }

        }
        else{

            if(isFavorite(route)){
                await deleteFavoriteStop(route);
                const newFavoriteStops = [...favoriteStops];
                const index = favoriteStops.indexOf(route);
                if(index !== -1){
                    newFavoriteStops.splice(favoriteStops.indexOf(route), 1);
                    setFavoriteStops(newFavoriteStops);
                    Toast.show({
                        type: "success",
                        text1: `${route} removed from favorites`,
                        position: "top"
                    });

                }
            }
            else{
                await addFavoriteStop(route);

                Toast.show({
                    type: "success",
                    text1: `${route} added to favorites`,
                    position: "top"
    
                });
    
                const newFavorites = [...favoriteStops];
                newFavorites.push(route);
                setFavoriteStops(newFavorites);
            }
        }
        
    }

    // handles selecting a stop from the filter
    const handleStopChange = (itemValue) => {
        setPlaceholder(itemValue.label)
        selectStop(itemValue);
        stopCode = itemValue.value

        console.log(stopCode);

        if (stopCode == "FAVSTOP") {
            setFavStop("FAVSTOP");
            async function fetchStopsByCodes(){
                let favorStops = await getFavoriteStops();
                console.log(favorStops);
                routeStops = await favoriteStopsToRouteList(stops, favorStops);
                if(routeStops.length == 0){
                    Toast.show({
                        type: "success",
                        text1: `No favorite stops`,
                        position: "top"
                    });
                }
                setRoutes(routeStops);

            }
            fetchStopsByCodes();

            /**
             * 
             */
            //navigate to stop component

            //console.log("fav stop")
        }
        else if (stopCode == "FAVROUTE") {
            setFavStop("FAVROUTE")
            async function fetchRoutesByCode() {
                const routesLocal = await getRoutesByCode(favorites);
                if (routesLocal.length == 0) {
                    Toast.show({
                        type: "success",
                        text1: `No favorite routes`,
                        position: "top"

                    });

                }
                setRoutes(routesLocal);
            }
            fetchRoutesByCode();
        }
        else {
            setFavStop("ROUTES")
            async function fetchScheduledRoutes() {
                try {

                    const routesLocal = await getScheduledRoutes(stopCode);
                    setRoutes(routesLocal)
                } catch (error) {
                    console.error('Error fetching stops:', error);
                }
            }

            fetchScheduledRoutes();
        }

    };

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);

    // clicking on a route navigates to specific info about that route
    const handleRouteInfoClick = async (shortName, fullName, color) => {
        if (canTrackData) {
            const location = await Location.getCurrentPositionAsync({});
            await saveUsageDataRecord({
                route: shortName,
                coords:
                {
                    lat: location.coords.latitude,
                    long: location.coords.longitude
                },
                time: new Date()
            });
        }

        if(favStop == "FAVSTOP"){
            navigation.navigate('StopInfo', {
                stopName: fullName,
                stopCode: shortName,
                fromFavorites: false
            });

        }
        else{
            navigation.navigate('RouteInfo', {
                routeShortName: shortName,
                routeName: fullName,
                routeColor: color
            });
        }

        
    };


    return (
        <View style={styles.container}>
            <MapViewMemo />
            <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: darkMode ? "gray" : "white" }}
            >
                <DropDownPicker
                    items={stops.map((stop, index) => ({
                        label: index < 3 ? stop[1] : `${stop[1]} (#${stop[0]})`,
                        value: stop[0]
                    }))}
                    defaultValue={selectedStop}
                    placeholder={placeHolder}
                    value={selectedStop}
                    containerStyle={{ height: 50, width: '95%', marginLeft: 10 }}
                    style={styles.picker}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                    onSelectItem={handleStopChange}
                    search={true}
                    open={open}
                    setOpen={setOpen}
                />


                <FlatList
                    data={routes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.flatListItem}>
                            <TouchableOpacity onPress={() => handleRouteInfoClick(item.RouteShortName, item.RouteName, item.RouteColor)} >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10 }} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {favStop === "FAVSTOP" ? <FontAwesome6 name="location-dot" size={20} color={'#' + item.RouteColor} solid /> : <FontAwesome6 name="bus-simple" size={20} color={'#' + item.RouteColor} />}
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 20, color: '#' + item.RouteColor, textAlign: 'left' }}>{item.RouteShortName}</Text>
                                            <Text style={{ fontSize: 22, color: '#' + item.RouteColor, fontWeight: 'bold' }}>{item.RouteName}</Text>

                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => onHeartPress(item.RouteShortName)}>
                                            <FontAwesome6 name="heart" size={22} style={{ color: isFavorite(item.RouteShortName) ? 'red' : 'black' }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleRouteInfoClick(item.RouteShortName, item.RouteName, item.RouteColor)}>
                                            <AntDesign name="right" size={22} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </TouchableOpacity>
                        </View>
                    )}
                />
            </BottomSheet>
        </View>
    );
}

// Memoized Map component to avoid unnecessary rerendering.
const MapViewMemo = React.memo(Map);
