import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_ROUTES_KEY = "favorite-routes";
const FAVORITE_STOPS_KEY = "favorite-stops";

/* Favorite routes */

/**
 * Sets the user's favorite routes, will overwrite any existing saved list
 * 
 * @param {string[]} favoriteRoutes array of route codes as strings
 */
export async function setFavoriteRoutes(favoriteRoutes) {
    try {
        await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches all the user's favorite routes
 * 
 * @returns array of saved route codes, or empty if nothing 
 */
export async function getFavoriteRoutes() {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        if (value !== null) {
            return JSON.parse(value);
        }
        return [];
    } catch (error) {
        console.error(error);
    }
}

/**
 * Add a single route to existing routes
 * 
 * @param {string} routeCode route code to add
 */
export async function addFavoriteRoute(routeCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        const favoriteRoutes = value !== null
            ? JSON.parse(value)
            : [];

        favoriteRoutes.push(routeCode);
        await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
    } catch (error) {
        console.error(error);
    }
}

/**
 * Delete a single route from existing routes
 * 
 * @param {string} routeCode route code to delete
 */
export async function deleteFavoriteRoute(routeCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        if (value !== null) {
            let favoriteRoutes = JSON.parse(value);
            favoriteRoutes = favoriteRoutes.filter(route => route !== routeCode);
            await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
        }
    } catch (error) {
        console.error(error);
    }
}

/* Favorite Stops */

/**
 * Sets the user's favorite stops, will overwrite any existing saved list
 * 
 * @param {number[]} favoriteStops array of stop codes as integers
 */
export async function setFavoriteStops(favoriteStops) {
    try {
        await AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify(favoriteStops));
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches all the user's favorite stops
 * 
 * @returns array of saved stop codes, or empty if nothing 
 */
export async function getFavoriteStops() {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_STOPS_KEY);
        if (value !== null) {
            return JSON.parse(value);
        }
        return value;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Add a single stop to existing stops
 * 
 * @param {number} stopCode stop code to add
 */
export async function addFavoriteStop(stopCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_STOPS_KEY);
        const favoriteStops = value !== null
            ? JSON.parse(value)
            : [];

        favoriteStops.push(stopCode);
        await AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify(favoriteStops));
    } catch (error) {
        console.error(error);
    }
}

/**
 * Delete a single stop from existing stops
 * 
 * @param {number} favoriteRoute stop code to delete
 */
export async function deleteFavoriteStop(stopCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_STOPS_KEY);
        if (value !== null) {
            let favoriteStops = JSON.parse(value);
            favoriteStops = favoriteStops.filter(stop => stop !== stopCode);
            await AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify(favoriteStops));
        }
    } catch (error) {
        console.error(error);
    }
}
