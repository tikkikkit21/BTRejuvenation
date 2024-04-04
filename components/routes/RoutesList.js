import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../../styles/Route.style';
import { FontAwesome, FontAwesome6, MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { getAllStops, getScheduledRoutes } from '../../backend/routeController';

export default function RoutesList() {
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedStop, selectStop] = useState("");
    const [placeHolder, setPlaceholder] = useState("")

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
                const routeLocal = await getScheduledRoutes("");
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

    return (
        <View style={styles.container}>
            <DropDownPicker
                items={stops.map(stop => ({ label: stop[1], value: stop[0] }))}
                defaultValue={selectedStop}
                placeholder={placeHolder}
                value={selectedStop}
                containerStyle={{ height: 50, width: '100%' }}
                style={styles.picker}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onSelectItem={handleStopChange}
                search={true}
                open={open}
                setOpen={setOpen}
            />
            <Text style={{ fontSize: 27, color: '#1E1E1E' }}>Scheduled Routes:</Text>
            <FlatList
                data={routes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.flatListItem}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome6 name="bus-simple" size={20} color={'#' + item.RouteColor} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontSize: 20, color: '#' + item.RouteColor, textAlign: 'left' }}>{item.RouteShortName}</Text>
                                    <Text style={{ fontSize: 22, color: '#' + item.RouteColor, fontWeight: 'bold' }}>{item.RouteName}</Text>
                                </View>
                            </View>
                            <AntDesign name="right" size={20} color={'#' + item.RouteColor} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
