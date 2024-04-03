import AsyncStorage from '@react-native-async-storage/async-storage';

// sets the user's favorite routes, will overwrite existing
export async function setFavoriteRoutes(favoriteRoutes) {
    try {
        await AsyncStorage.setItem("favorite-routes", favoriteRoutes);
    } catch (error) {
        console.error(error);
    }
}

// fetches all the user's favorite routes, may be null
export async function getFavoriteRoutes() {
    try {
        return await AsyncStorage.getItem("favorite-routes");
    } catch (error) {
        console.error(error);
    }
}
