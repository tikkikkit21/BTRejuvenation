import React, { useEffect, useState } from 'react';
import { View, Text, FlatList} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/Route.style';
import { getAllStops, getScheduledRoutes } from '../backend/routeController';


function RouteTab() {
    const [open, setOpen] = useState(false);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedStop, selectStop] = useState("");
   useEffect(() => {
    //populate our structures with data from the api
    async function fetchStops() {
        try {
            const stopLocal = await getAllStops();
            setStops(stopLocal);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    }
   
    fetchStops();

    async function fetchAllRoutes(){
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
 
    selectStop(itemValue);
    stopCode = itemValue.value

    //backend call to get the scheduled routes, and uses the stopcode to fetch databse
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
        {/* populates the picker with all the routes */}
            <DropDownPicker
                items={stops.map(stop => ({ label: stop[1], value: stop[0] }))}
                defaultValue={selectedStop}
                placeholder="--Filter By Stop--"
                value = {selectedStop}
                containerStyle={{ height: 50, width: '100%' }}
                style={styles.picker}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onSelectItem={handleStopChange}
                search = {true}
                open={open}
                setOpen={setOpen}
            />
            <Text style = {{fontSize: 27,color: '#1E1E1E'}}>Scheduled Routes:</Text>
            {/* populates the list with busses, and puts them into their desired color */}
            <FlatList
                data={routes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style = {styles.flatListItem}>
                        <Text style = {{fontSize: 20, color: '#' + item[1], textAlign: 'left'}}>{item[2]}</Text>
                        <Text style = {{fontSize: 22, color: '#' + item[1], fontWeight: 'bold'}}>{item[0]}</Text>

                    </View>
                )}
            />
        </View>
    );
}

export default RouteTab;
