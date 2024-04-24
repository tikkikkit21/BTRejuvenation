import axios, { all } from "axios";

const APIKEY = process.env.GOOGLE_MAPS_API_KEY;
const GMAPS_ROOT = "https://maps.googleapis.com/maps/api/directions";

/**
 * Takes an origin and destination and finds connected BT bus routes between the
 * two
 * 
 * NOTE: Only supports representing 1 main bus line, not connecting busses.
 * 
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

    const tripSteps = data.routes[0].legs[0].steps;

    const totalDuration = getTotalDuration(tripSteps);
    const totalDistance = getTotalDistance(tripSteps);
    const mainBusLine = getBusLine(tripSteps);
    
    return tripSteps.map(step => {
        return {
            points: decodeCoords(step.polyline.points),
            // Check if step has transit_details and line properties before accessing them
            routeName: step.transit_details && step.transit_details.line ? step.transit_details.line.short_name : null,
            duration: step.duration ? step.duration.text : null,
            distance: step.distance,
            instructions: step.html_instructions,
            totalDuration: totalDuration,
            totalDistance: totalDistance,
            mainBusLine: mainBusLine
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

/**
 * Function to calculate total duration of a trip.
 * 
 * @param {*} legs Contains trip information from origin to end destination.
 * @returns Total duraiton of trip.
 */
function getTotalDuration(legs) {
    let totalDuration = {
        minutes: 0,
        hours: 0
    };

    if (legs && Array.isArray(legs)) {
        legs.forEach(leg => {
            if (leg.duration && leg.duration.text) {
                const durationText = leg.duration.text;
                // Extract numerical value of minutes
                const durationMatch = durationText.match(/\b\d+\b/);
                if (durationMatch && durationMatch.length > 0) {
                    const durationInMinutes = parseInt(durationMatch[0]);
                    totalDuration.minutes += durationInMinutes;
                } else {
                    console.error("Invalid duration format:", durationText);
                }
            } else {
                console.error("Duration text not found in the leg object:", leg);
            }
        });

        // Convert minutes to hours if necessary
        if (totalDuration.minutes >= 60) {
            totalDuration.hours = Math.floor(totalDuration.minutes / 60);
            totalDuration.minutes = totalDuration.minutes % 60;
        }
    } else {
        console.error("Invalid legs data:", legs);
    }

    let formattedDuration = '';
    if (totalDuration.hours > 0) {
        formattedDuration += totalDuration.hours + ' hours ';
    }
    if (totalDuration.minutes > 0) {
        formattedDuration += totalDuration.minutes + ' minutes';
    }

    return formattedDuration.trim();
}

/**
 * Function to calculate total distance in trip.
 * 
 * @param {*} legs Contains trip information from origin to end destination.
 * @returns Total distance of trip.
 */
function getTotalDistance(legs) {
    let totalDistanceMiles = 0;

    if (legs && Array.isArray(legs)) {
        legs.forEach(leg => {
            if (leg.distance && leg.distance.text) {
                // Extract the numeric distance value from the text
                const numericDistance = parseFloat(leg.distance.text.replace(/[^\d.]/g, ''));
                // Determine the unit of the distance
                const distanceUnit = leg.distance.text.includes('mi') ? 'miles' : 'feet';
                // Convert feet to miles if necessary
                const distanceInMiles = distanceUnit === 'miles' ? numericDistance : numericDistance / 5280;
                // Add the distance in miles to the total
                totalDistanceMiles += distanceInMiles;
            } else {
                console.error("Distance text not found in the leg object:", leg);
            }
        });
    } else {
        console.error("Invalid legs data:", legs);
    }

    // Return the total distance in miles
    return totalDistanceMiles.toFixed(2) + ' miles';
}

/**
 * Function to extract bus line to take from transit leg.
 * 
 * NOTE: Will need to modify for connecting bus lines. (more than 1 bus line for a trip)
 * 
 * @param {*} leg Contains trip information from origin to end destination.
 * @returns The bus line for the trip.
 */
function getBusLine(legs) {
    for (const leg of legs) {
        if (leg.travel_mode === "TRANSIT" && leg.transit_details && leg.transit_details.line) {
            return leg.transit_details.line.short_name;
        }
    }
    return "N/A";
}

