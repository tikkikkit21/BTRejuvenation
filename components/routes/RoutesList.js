import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../../styles/Route.style';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome, FontAwesome6, MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { getAllStops, getCurrentRoutes, getScheduledRoutes } from '../../backend/routeController';
import Map from '../home/Map';
import { addFavoriteRoute, deleteFavoriteRoute, getFavoriteRoutes, saveFavoriteRoutes } from '../../backend/userController';

function RoutesList({ mapRegion, setMapRegion, buses, setBuses, busStops, setBusStops, route, setRoute, isOnCooldown, setIsOnCooldown }) {
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedStop, selectStop] = useState("");
    const [placeHolder, setPlaceholder] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [heartColor, setHeartColor] = useState('black');

    const navigation = useNavigation();

    //TODO: Create a method that uses the favorites useState to check to see if 
    //there is a favorite for this user, instead of calling async every time

    useEffect(() => {

        setPlaceholder("Filter By Route")
        
        async function fetchStops() {
            try {
                const stopLocal = await getAllStops();
                const updatedStops = [["Stop Number", "All Routes"], ...stopLocal];
                setStops(updatedStops);
                //console.log(stops);
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

        async function getFavorites(){

            favs = await getFavoriteRoutes();
            //console.log(favs)

            setFavorites(favs);
        }
        getFavorites();

        
    }, []);

    useEffect(() =>{
        async function getFavorites(){

            favs = await getFavoriteRoutes();
            //console.log(favs)

            setFavorites(favs);
        }
        getFavorites();

    }, [favorites]);

    function isFavorite(route){
        //console.log(`is favorite ${favorites}` );
        if(favorites.includes(route) > 0){
            setHeartColor('red');
            return true;
        }
        return false;
    }

    async function onHeartPress(route) {
        //const newColor = isFavorite(route) ? 'black' : 'red';
    
       // saveFavoriteRoutes([]);
        if (isFavorite(route)) {
            await deleteFavoriteRoute(route);
            alert(`${route} removed from favorites`);
        } else {
            await addFavoriteRoute(route);
            alert(`${route} added to favorites`);

            favs = await getFavoriteRoutes();
            setFavorites(favs);
            
        }
    
    }


    const handleStopChange = (itemValue) => {
        setPlaceholder(itemValue.label)
        selectStop(itemValue);
        stopCode = itemValue.value

        async function fetchScheduledRoutes() {
            try {
                
                const routesLocal = await getScheduledRoutes(stopCode);
                setRoutes(routesLocal)
            } catch (error) {
                console.error('Error fetching stops:', error);
            }
        }

        fetchScheduledRoutes();

    };

    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);

    const handleRouteInfoClick = (shortName, fullName, color) => {
        navigation.navigate('RouteInfo', {
            routeShortName: shortName,
            routeName: fullName,
            routeColor: color
        });
    };


    return (
        <View style={styles.container}>
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
            <BottomSheet
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            >
                <DropDownPicker
                    items={stops.map((stop, index) => ({label: index === 0 ? stop[1] : `${stop[1]} (#${stop[0]})`,
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
                            <TouchableOpacity  onPress={() => handleRouteInfoClick(item.RouteShortName, item.RouteName, item.RouteColor)} >
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
                                            <FontAwesome6 name="heart" size={22}  style={{ color: isFavorite(item.RouteShortName) ? 'red' : 'black' }}/>
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

// Memoize RoutesList component
const MemoizedRoutesList = React.memo(RoutesList);

export default MemoizedRoutesList;
