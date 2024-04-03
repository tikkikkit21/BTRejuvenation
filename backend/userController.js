import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_ROUTES_KEY = "favorite-routes";

// sets the user's favorite routes, will overwrite existing
export async function setFavoriteRoutes(favoriteRoutes) {
    try {
        await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
    } catch (error) {
        console.error(error);
    }
}

// fetches all the user's favorite routes, may be null
export async function getFavoriteRoutes() {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        if (value !== null) {
            return JSON.parse(value);
        }
        return value;
    } catch (error) {
        console.error(error);
    }
}

// add a single route to existing routes
export async function addFavoriteRoute(favoriteRoute) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        const favoriteRoutes = value !== null
            ? JSON.parse(value)
            : [];

        favoriteRoutes.push(favoriteRoute);
        await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
    } catch (error) {
        console.error(error);
    }
}

// delete a single route from existing routes
export async function deleteFavoriteRoute(favoriteRoute) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        if (value !== null) {
            let favoriteRoutes = JSON.parse(value);
            favoriteRoutes = favoriteRoutes.filter(route => route !== favoriteRoute);
            await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
        }
    } catch (error) {
        console.error(error);
    }
}
