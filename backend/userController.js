import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setFavoriteRoutes(favoriteRoutes) {
    try {
        await AsyncStorage.setItem("favorite-routes", favoriteRoutes);
    } catch (error) {
        console.error(error);
    }
}

export async function getFavoriteRoutes() {
    try {
        return await AsyncStorage.getItem("favorite-routes");
    } catch (error) {
        console.error(error);
    }
}
