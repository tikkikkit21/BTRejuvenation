import AsyncStorage from '@react-native-async-storage/async-storage';

// sets the user's favorite routes, will overwrite existing
export async function setFavoriteRoutes(favoriteRoutes) {
    try {
        await AsyncStorage.setItem("favorite-routes", JSON.stringify(favoriteRoutes));
    } catch (error) {
        console.error(error);
    }
}

// fetches all the user's favorite routes, may be null
export async function getFavoriteRoutes() {
    try {
        const value = await AsyncStorage.getItem("favorite-routes");
        if (value !== null) {
            return JSON.parse(value);
        }
        return value;
    } catch (error) {
        console.error(error);
    }
}

export async function addFavoriteRoute(favoriteRoute) {
    try {
        const value = await AsyncStorage.getItem("favorite-routes");
        const favoriteRoutes = value !== null
            ? favoriteRoutes = JSON.parse(value)
            : [];

        favoriteRoutes.append(favoriteRoute);
        await AsyncStorage.setItem("favorite-routes", JSON.stringify(favoriteRoutes));
    } catch (error) {
        console.error(error);
    }
}
