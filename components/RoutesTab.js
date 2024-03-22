import React, { useEffect, useState } from 'react';
import { View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/Route.style';
import { getAllStops } from '../backend/routeController';

function RouteTab() {
    const [stops, setStops] = useState([]);
    const [selectedStop, selectStop] = useState("--Filter By Stop--");
   useEffect(() => {
    async function fetchStops() {
        try {
            const stopLocal = await getAllStops();
            console.log(stopLocal)
            setStops(stopLocal);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    }
   
    fetchStops();
   }, []);
   const handleStopChange = (itemValue, itemIndex) => {
    // console.log(itemValue) RETURNS CODE
    selectStop(itemValue);
};

// const pickerItems = [];
// for (let i = 0; i < stops.length; i++) {
//     const stop = stops[i];
//     pickerItems.push(<Picker.Item key={i} label={stop[1]} value={stop[0]} />);
// }
    return (
        <View style={styles.container}>
             <DropDownPicker
                items={stops.map(stop => ({ label: stop[1], value: stop[0] }))}
                defaultValue={selectedStop}
                placeholder="--Filter By Stop--"
                containerStyle={{ height: 50, width: '100%' }}
                style={styles.picker}
               
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChange={handleStopChange}
                search = {true}
            />
                {/* <Picker.Item label="--Filter By Stop--" value="code" />
                {pickerItems} */}
            <Text>This is the route Tab</Text>
        </View>
    );
}

export default RouteTab;
