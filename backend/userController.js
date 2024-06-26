import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_ROUTES_KEY = "favorite-routes";
const FAVORITE_STOPS_KEY = "favorite-stops";
const TRACK_APP_USAGE_KEY = "track-app-usage";
const USAGE_DATA_KEY = "usage-data";
const DARK_MODE_KEY = "dark-mode";
const REFRESH_FREQUENCY_KEY = "refresh-frequency";

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
        //console.log(value);
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

/** AI stuff */
/**
 * Set whether or not to track user app usage
 * @param {boolean} canTrack user setting whether to track app usage
 */
export async function setTrackingPermission(canTrack) {
    if (typeof canTrack !== "boolean") {
        throw new TypeError("canTrack must be a boolean");
    }
    await AsyncStorage.setItem(TRACK_APP_USAGE_KEY, canTrack ? "t" : "f");
}

/**
 * Get user setting whether to track app usage
 * @returns {boolean} whether or not to track usage
 */
export async function getTrackingPermission() {
    const canTrack = await AsyncStorage.getItem(TRACK_APP_USAGE_KEY);
    return canTrack
        ? canTrack === "t"
        : false;
}

/**
 * Save a record of user usage
 * @param {Object} data data record
 * @param {string} data.route route the user looked at
 * @param {{lat: Number, long: Number}} data.coords location of user
 * @param {Date} data.time time the user checked route
 * @returns {boolean} whether saving was successful or not
 */
export async function saveUsageDataRecord(data) {
    try {
        if (!data.time || !data.coords || !data.time) {
            throw new TypeError("Data record missing a field, see JSDoc for argument structure");
        }

        const storedRecords = await AsyncStorage.getItem(USAGE_DATA_KEY);
        const records = storedRecords
            ? JSON.parse(storedRecords)
            : [];
        records.push(data);

        await AsyncStorage.setItem(USAGE_DATA_KEY, JSON.stringify(records));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Clears storage of all data records
 * @returns {boolean} whether deleting was successful or not
 */
export async function clearUsageData() {
    try {
        await AsyncStorage.setItem(USAGE_DATA_KEY, JSON.stringify([]));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Get a suggested route given current user behavior
 * @param {Object} data data record
 * @param {{lat: Number, long: Number}} data.coords location of user
 * @param {Date} data.time time the user checked route
 * @returns {string} predicted route code (ex: "HWA") or null if none
 */
export async function getSuggestedRoute(data) {
    const storedRecords = await AsyncStorage.getItem(USAGE_DATA_KEY);
    const records = storedRecords
        ? JSON.parse(storedRecords)
        : [];

    // not enough data to predict
    if (records.length < 5) return null;

    // find all similar records to provided data
    const similarRecords = records.filter(record => {
        record.time = new Date(record.time);
        return getSimilarity(data, record) <= 1.0;
    });

    // record each unique suggested route and their "votes"
    const routes = {};
    similarRecords.forEach(record => {
        if (!routes[record.route]) {
            routes[record.route] = 0;
        }

        routes[record.route]++;
    });

    // find most frequent route
    let maxCount = 0;
    let maxRoute = "";
    for (const route in routes) {
        if (routes[route] > maxCount) {
            maxCount = routes[route];
            maxRoute = route;
        }
    }

    // if route is suggested by at least 20% of all records, we accept
    if ((maxCount * 1.0) / records.length >= 0.2) {
        return maxRoute;
    }

    return null;
}

/**
 * Calculates how similar 2 data records are where 0 is identical, 1 is max
 * difference to consider the record. The lower the result, the more similar
 * they are
 * @returns {Number} how similar
 */
function getSimilarity(data1, data2) {
    // set date to same
    data1.time.setDate(data2.time.getDate());
    data1.time.setMonth(data2.time.getMonth());
    data1.time.setFullYear(data2.time.getFullYear());

    // time difference in seconds
    const timeDiff = Math.abs(data1.time.getTime() - data2.time.getTime()) / 1000;

    // location Euclidean distance
    const eDist = Math.sqrt(
        (data1.coords.lat - data2.coords.lat) ** 2
        + (data1.coords.long - data2.coords.long) ** 2
    );

    // time of 1 is half hour, dist of 1 is 150ft away
    const timeNorm = timeDiff / (60 * 30);
    const distNorm = eDist * 2065.0;

    // return average of the 2 similarities (assumes both features are equally
    // important)
    return (timeNorm + distNorm) / 2.0;
}

/** User settings */
/**
 * Change user's dark mode preference
 * @param {boolean} mode true for dark mode, false for light mode
 */
export async function setDarkModeSetting(mode) {
    await AsyncStorage.setItem(DARK_MODE_KEY, mode ? "t" : "f");
}

/**
 * Get user's dark mode preference
 * @returns {boolean} tru for dark mode, false for light mode
 */
export async function getDarkModeSetting() {
    const value = await AsyncStorage.getItem(DARK_MODE_KEY);
    return value
        ? value === "t"
        : false;
}

/**
 * Change user's refresh frequency setting
 * @param {number} frequency refresh frequency in seconds
 */
export async function setRefreshFrequencySetting(frequency) {
    await AsyncStorage.setItem(REFRESH_FREQUENCY_KEY, frequency.toString());
}

/**
 * Get user's refresh frequency setting
 * @returns {number} refresh frequency in seconds
 */
export async function getRefreshFrequencySetting() {
    const value = await AsyncStorage.getItem(REFRESH_FREQUENCY_KEY);
    return value
        ? Number(value)
        : 30;
}
