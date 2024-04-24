import axios from "axios";

const APIKEY = process.env.GOOGLE_MAPS_API_KEY;
const GMAPS_ROOT = "https://maps.googleapis.com/maps/api/directions";

/**
 * Takes an origin and destination and finds connected BT bus routes between the
 * two
 * @param {string} origin origin address or coordinates in string format
 * @param {*} destination dest address or coordinates in string format
 * @returns an array of trip legs with the following properties:
 * - polyline: array of coords for drawing route
 * - routeName: the BT route name for this leg
 * - duration: how long this leg will take
 * - distance: distance travelled on this leg
 * - instructions: text description of the leg
 */
export async function getConnectedRoutes(origin, destination) {
    const query = `json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=transit`;
    const test = `json?origin=${'Torgersen Hall'}&destination=${'401 Laurence Ln'}&key=${APIKEY}&mode=transit`;
    const { data } = await axios.get(`${GMAPS_ROOT}/${test}`);

    const legs = data.routes[0].legs[0]

    const tripDetails = calculateTripDetails(legs);
    console.log('\nDuration: ', tripDetails.totalDuration);
    console.log('\nBus Line: ', tripDetails.busLine);

    const transitSteps = data.routes[0].legs[0].steps
        .filter(step => step.travel_mode === "TRANSIT")
        .filter(step => step.transit_details.line.agencies[0][0].name === "Blacksburg Transit");

    return transitSteps.map(step => {
        // console.log(step);
        return {
            polyline: decodeCoords(step.polyline),
            routeName: step.transit_details.line.short_name,
            duration: step.duration,
            distance: step.distance,
            instructions: html_instructions
        };
    });
}

/**
 * transforms something like this geocFltrhVvDsEtA}ApSsVrDaEvAcBSYOS_@... to an
 * array of coordinates
 * 
 * source: https://github.com/react-native-maps/react-native-maps/issues/929#issuecomment-271365235
 */
function decodeCoords(t, e) {
    for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
        a = null, h = 0, i = 0;

        do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5;
        while (a >= 32);
        n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;

        do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5;
        while (a >= 32);
        o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c])
    }

    return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } });
}

// Function to calculate total duration of the trip
function getTotalDuration(legs) {
    let totalDuration = 0;
    for (const leg of legs) {
        totalDuration += leg.duration.value;
    }
    return totalDuration;
}

// Function to extract bus line to take from transit leg
function getBusLine(leg) {
    if (leg.travel_mode === "TRANSIT" && leg.transit_details && leg.transit_details.line) {
        return leg.transit_details.line.short_name;
    }
    return "N/A";
}

// Calculate total duration and bus line for the trip
function calculateTripDetails(legs) {
    let totalDuration = getTotalDuration(legs);
    let busLine = "N/A";
    for (const leg of legs) {
        if (leg.travel_mode === "TRANSIT") {
            busLine = getBusLine(leg);
            break; // Stop searching once the first transit leg is found
        }
    }
    return { totalDuration, busLine };
}
