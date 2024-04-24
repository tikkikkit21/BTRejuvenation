import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAlerts } from '../../backend/alertController';
import { MaterialCommunityIcons, Foundation, AntDesign } from '@expo/vector-icons';

const iconDict = {
    1: <Foundation name="prohibited" size={30} color="black" />,
    2: <MaterialCommunityIcons name="bus-articulated-front" size={30} color="black" />,
    3: <MaterialCommunityIcons name="bus-clock" size={30} color="black" />,
    4: <MaterialCommunityIcons name="transit-detour" size={30} color="black" />,
    5: <MaterialCommunityIcons name="bus-multiple" size={30} color="black" />,
    6: <MaterialCommunityIcons name="bus-marker" size={30} color="black" />,
    7: <MaterialCommunityIcons name="bus-stop" size={30} color="black" />,
    8: <MaterialCommunityIcons name="bus-alert" size={30} color="black" />,
    9: <MaterialCommunityIcons name="alert" size={30} color="black" />
}

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        async function fetchAlerts() {
            const alertsData = await getAlerts();
            if (alertsData.length > 0) {
                setAlerts(alertsData);
            }
        }
        fetchAlerts();
    }, []);

    const alertViews = alerts.map(alert => {
        return <View style={styles.alertSection}>
            <View style={styles.alertText}>
                {iconDict[alert.AlertCausesID] || iconDict[9]}
                <Text style={styles.alertTitle}>{alert.AlertTitle}</Text>
            </View>
            <AntDesign name="right" />
        </View>;
    });

    return (
        <ScrollView>
            <View style={styles.container}>
                {alertViews}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    alertSection: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    alertText: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    alertTitle: {
        fontSize: 20,
        flex: 1,
        marginLeft: 5
    },
    alertDescription: {
        fontSize: 10
    }
});
