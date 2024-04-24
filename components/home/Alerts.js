import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAlerts } from '../../backend/alertController';

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
            <Text style={styles.alertTitle}>{alert.AlertTitle}</Text>
            <Text style={styles.alertDescription}>{alert.AlertMessage}</Text>
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
        padding: 25
    },
    alertSection: {
        margin: 3,
        padding: 5,
        borderBottomColor: "black",
        borderWidth: 1,
    },
    alertTitle: {
        fontSize: 15
    },
    alertDescription: {
        fontSize: 10
    }
});
