import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../../styles/Route.style';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome, FontAwesome6, MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { getAllStops, getScheduledRoutes } from '../../backend/routeController';
import Map from '../home/Map';

export default function RoutesList() {
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedStop, selectStop] = useState("");
    const [placeHolder, setPlaceholder] = useState("")
    const navigation = useNavigation();


    useEffect(() => {

        setPlaceholder("Filter By Route")
        async function fetchStops() {
            try {
                const stopLocal = await getAllStops();
                const updatedStops = [["", "All Routes"], ...stopLocal];
                setStops(updatedStops);
            } catch (error) {
                console.error('Error fetching stops:', error);
            }
        }

        fetchStops();

        async function fetchAllRoutes() {
            try {
                const routeLocal = await getScheduledRoutes();
                setRoutes(routeLocal);
            } catch (error) {
                console.error('Error fetching stops:', error);
            }
        }

        fetchAllRoutes()
    }, []);

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
        console.log(shortName); 
        console.log(fullName);
        console.log(color);
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
                    items={stops.map(stop => ({ label: stop[1], value: stop[0] }))}
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome6 name="bus-simple" size={20} color={'#' + item.RouteColor} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 20, color: '#' + item.RouteColor, textAlign: 'left' }}>{item.RouteShortName}</Text>
                                        <Text style={{ fontSize: 22, color: '#' + item.RouteColor, fontWeight: 'bold' }}>{item.RouteName}</Text>
                                       
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleRouteInfoClick(item.RouteShortName, item.RouteName, item.RouteColor)}>
                                    <AntDesign name="right" size={22} />
                                     {/*Add an onclick to the touchable opcatiy, where it takes you to the new compnent for the busses. Bus information, route information
                                        and latest trips */}
                                </TouchableOpacity>
                            </View>
                            {/* <AntDesign name="right" size={20} color={'#' + item.RouteColor} /> */}
                        </View>
                    )}
                />
            </BottomSheet>
        </View>
    );
}

// Memoized Map component to avoid unnecessary rerendering.
const MapViewMemo = React.memo(Map);
