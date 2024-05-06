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
    // const test = `json?origin=${'Torgersen Hall'}&destination=${'401 Laurence Ln'}&key=${APIKEY}&mode=transit`;
    const { data } = await axios.get(`${GMAPS_ROOT}/${query}`);

    const tripSteps = data.routes[0].legs[0].steps;
    const totalDuration = data.routes[0].legs[0].duration.text;
    const totalDistance = data.routes[0].legs[0].distance.text;
    const arrivalTime = data.routes[0].legs[0].arrival_time.text;
    const departureTime = data.routes[0].legs[0].departure_time.text;
    const mainBusLine = getBusLine(tripSteps);
    const busColors = getBusColors(tripSteps);
    const routeSteps = [];
    
    // Iterate over each step and append it to the array
    tripSteps.forEach(step => {
        console.log("Step: ", step);
        const routeStep = {
            points: decodeCoords(step.polyline.points),
            routeName: step.transit_details && step.transit_details.line ? step.transit_details.line.short_name : null,
            duration: step.duration ? step.duration.text : null,
            distance: step.distance,
            instructions: step.html_instructions
        };
        routeSteps.push(routeStep);
    });

    return { mainBusLine, busColors, totalDuration, totalDistance, arrivalTime, departureTime, routeSteps };
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
 * Function to extract bus line to take from transit leg.
 *  
 * @param {*} leg Contains trip information from origin to end destination.
 * @returns The bus line for the trip.
 */
function getBusLine(legs) {
    const busTransit = [];
    for (const leg of legs) {
        if (leg.travel_mode === "TRANSIT" && leg.transit_details && leg.transit_details.line) {
            busTransit.push(leg.transit_details.line.name);
        }
    }
    return busTransit;
}

/**
 * Extracts the colors of the buses on the trip.
 * 
 * @param {*} legs Contains trip information from origin to end destination.
 * @returns The bus colors of the trip.
 */
function getBusColors(legs) {
    const busColors = [];
    for (const leg of legs) {
        if (leg.travel_mode === "TRANSIT" && leg.transit_details && leg.transit_details.line) {
            const lineColor = leg.transit_details.line.color;
            const lineName = leg.transit_details.line.short_name;
            busColors.push({ color: lineColor, name: lineName })
        }
    }
    return busColors;
}
