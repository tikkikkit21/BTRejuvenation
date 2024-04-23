import { View, Text, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Map from '../home/Map';

function Favorites({ mapRegion, setMapRegion, buses, setBuses, stops, setStops, route, setRoute, isOnCooldown, setIsOnCooldown }) {
    // Points of the screen where the bottom sheet extends to
    const snapPoints = useMemo(() => ['10%','25%', '50%', '70%', '95%'], []);

    return (
        <View style={styles.container}>
          <MapViewMemo 
                mapRegion={mapRegion}
                setMapRegion={setMapRegion}
                buses={buses}
                setBuses={setBuses}
                stops={stops}
                setStops={setStops}
                route={route}
                setRoute={setRoute}
                isOnCooldown={isOnCooldown}
                setIsOnCooldown={setIsOnCooldown}
            />
          <BottomSheet 
              snapPoints={snapPoints}
              backgroundStyle={{backgroundColor: '#7F1237'}}
          >
            <View style={[styles.inputContainer, styles.favoritesTextContainer]}>
                <Text style={styles.favoritesText}>This is the Favorites Tab</Text>
              </View>
          </BottomSheet>
        </View>
    );
}

// Memoized Map component to avoid unnecessary rerendering.
const MapViewMemo = React.memo(Map);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        paddingHorizontal: 10,
        alignItems: 'center',
        marginLeft: 20,
    },
    favoritesTextContainer: {
        marginTop: 5,
        backgroundColor: '#A24857',
        paddingTop: 10,
        paddingBottom: 10,
    },
    favoritesText: {
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
        marginLeft: 100,
    }
  });

// Memoize Favorites component
const MemoizedFavorites = React.memo(Favorites);

export default MemoizedFavorites;
