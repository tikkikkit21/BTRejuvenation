import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_ROUTES_KEY = "favorite-routes";
const FAVORITE_STOPS_KEY = "favorite-stops";
const TRACK_APP_USAGE_KEY = "track-app-usage";
const USAGE_DATA_KEY = "usage-data"

/* Favorite routes */

/**
 * Saves the user's favorite routes, will overwrite any existing saved list
 * 
 * @param {string[]} favoriteRoutes array of route codes as strings
 * @returns true if success, false if it failed
 */
export async function saveFavoriteRoutes(favoriteRoutes) {
    try {
        await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
        return true;
    } catch (error) {
        console.error(error);
        return false;
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
 * Add a single route to existing favorite routes
 * 
 * @param {string} routeCode route code to add
 * @returns true if success, false if it failed
 */
export async function addFavoriteRoute(routeCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        const favoriteRoutes = value !== null
            ? JSON.parse(value)
            : [];
        favoriteRoutes.push(routeCode);
        await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Delete a single route from existing favorite routes. To delete all favorite
 * routes, `use saveFavoriteRoutes([])`
 * 
 * @param {string} routeCode route code to delete
 * @returns true if success, false if it failed
 */
export async function deleteFavoriteRoute(routeCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_ROUTES_KEY);
        if (value !== null) {
            let favoriteRoutes = JSON.parse(value);
            favoriteRoutes = favoriteRoutes.filter(route => route !== routeCode);
            await AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify(favoriteRoutes));
        }
        return true;
    } catch (error) {
        console.error(error);
        return false
    }
}

/* Favorite Stops */

/**
 * Saves the user's favorite stops, will overwrite any existing saved list
 * 
 * @param {number[]} favoriteStops array of stop codes as integers
 * @returns true if success, false if it failed
 */
export async function saveFavoriteStops(favoriteStops) {
    try {
        await AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify(favoriteStops));
        return true;
    } catch (error) {
        console.error(error);
        return false;
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
 * Add a single stop to existing favorite stops
 * 
 * @param {number} stopCode stop code to add
 * @returns true if success, false if it failed
 */
export async function addFavoriteStop(stopCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_STOPS_KEY);
        const favoriteStops = value !== null
            ? JSON.parse(value)
            : [];
        favoriteStops.push(stopCode);
        await AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify(favoriteStops));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Delete a single stop from existing favorite stops. To delete all favorite
 * stops, use `saveFavoriteStops([])`
 * 
 * @param {number} favoriteRoute stop code to delete
 * @returns true if success, false if it failed
 */
export async function deleteFavoriteStop(stopCode) {
    try {
        const value = await AsyncStorage.getItem(FAVORITE_STOPS_KEY);
        if (value !== null) {
            let favoriteStops = JSON.parse(value);
            favoriteStops = favoriteStops.filter(stop => stop !== stopCode);
            await AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify(favoriteStops));
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Set whether or not to track user app usage
 * @param {boolean} canTrack user setting whether to track app usage
 */
export async function setTrackingPermission(canTrack) {
    if (typeof canTrack !== "boolean") {
        throw new TypeError("canTrack must be a boolean");
    }
    await AsyncStorage.setItem(TRACK_APP_USAGE_KEY, canTrack);
}

/**
 * Get user setting whether to track app usage
 * @returns {boolean} whether or not to track usage
 */
export async function getTrackingPermission() {
    const canTrack = await AsyncStorage.getItem(TRACK_APP_USAGE_KEY);
    return canTrack || false;
}

/**
 * Save a record of user usage
 * @param {Object} data data record
 * @param {string} data.route route the user looked at
 * @param {{long: Number, lat: Number}} data.coords location of user
 * @param {Date} data.time time the user checked route
 * @returns {boolean} whether saving was successful or not
 */
export async function saveUsageDataRecord(data) {
    try {
        if (!data.time || !data.coords || !data.time) {
            throw new TypeError("Data record missing a field, see JSDoc for argument structure");
        }

        const records = await AsyncStorage.getItem(USAGE_DATA_KEY) || [];
        records.push(data);
        await AsyncStorage.setItem(USAGE_DATA_KEY, JSON.stringify(records));

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
