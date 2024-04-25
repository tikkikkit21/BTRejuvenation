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
import { addFavoriteRoute, deleteFavoriteRoute, getFavoriteRoutes, saveFavoriteRoutes } from '../../backend/userController';
import { saveUsageDataRecord } from '../../backend/userController';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';

export default function RoutesList() {
    const navigation = useNavigation();

    // state variables
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedStop, selectStop] = useState("");
    const [placeHolder, setPlaceholder] = useState("Filter By Route");
    const [favorites, setFavorites] = useState([]);
    // const [heartColor, setHeartColor] = useState('black');

    // redux variables
    const darkMode = useSelector(state => state.darkMode.isEnabled);
    const canTrackData = useSelector(state => state.usageTracking.isEnabled);

    //TODO: Create a method that uses the favorites useState to check to see if 
    //there is a favorite for this user, instead of calling async every time

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

        fetchStops();

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

        fetchAllRoutes()

        async function getFavorites() {

            favs = await getFavoriteRoutes();
            setFavorites(favs);
        }
        getFavorites();


    }, []);

    useEffect(() => {
        async function getFavorites() {

            favs = await getFavoriteRoutes();
            setFavorites(favs);
        }
        getFavorites();

    }, [favorites]);

    function isFavorite(route) {
        // if (favorites.includes(route) > 0) {
        //     setHeartColor('red');
        //     return true;
        // }
        // return false;
        return favorites.includes(route);
    }

    // pressing heart favorites/unfavorites a route
    async function onHeartPress(route) {
        // remove favorite route
        if (isFavorite(route)) {
            await deleteFavoriteRoute(route);
            const newFavorites = favorites.splice(favorites.indexOf(route), 1);
            setFavorites(newFavorites);
            Toast.show({
                type: "success",
                text1: `${route} removed from favorites`,
                position: "top"
            });
        }

        // add favorite route
        else {
            await addFavoriteRoute(route);
            Toast.show({
                type: "success",
                text1: `${route} added to favorites`,
                position: "top"

            });

            const newFavorites = favorites.push(route);
            setFavorites(newFavorites);

            // favs = await getFavoriteRoutes();
            // setFavorites(favs);
        }

    }


    const handleStopChange = (itemValue) => {
        setPlaceholder(itemValue.label)
        selectStop(itemValue);
        stopCode = itemValue.value

        if (stopCode == "FAVSTOP") {
            //navigate to stop component

            console.log("fav stop")
        }
        else if (stopCode == "FAVROUTE") {
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

        navigation.navigate('RouteInfo', {
            routeShortName: shortName,
            routeName: fullName,
            routeColor: color
        });
    };


    return (
        <View style={styles.container}>
            <MapViewMemo />
            <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
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
                                        <FontAwesome6 name="bus-simple" size={20} color={'#' + item.RouteColor} />
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
