import axios from "axios";

const origin = '11200 Foxtrail Ln, Blacksburg, VA 24060';
const destination = '2000 Kraft Dr SW STE 2000, Blacksburg, VA 24060';
const APIKEY = process.env.GOOGLE_MAPS_API_KEY;

const GMAPS_ROOT = "https://maps.googleapis.com/maps/api/directions"
const GMAPS_QUERY = `json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=transit`;

/**
 * no idea what i'm doing
 */
export async function idfk() {
    console.log("function called");
    const { data } = await axios.get(`${GMAPS_ROOT}/${GMAPS_QUERY}`);

    const transitSteps = data.routes[0].legs[0].steps
        .filter(step => step.travel_mode === "TRANSIT")
        .filter(step => step.transit_details.line.agencies[0][0].name === "Blacksburg Transit")

    return transitSteps.map(step => {
        return {
            polyline: decode(step.polyline),
            routeName: step.transit_details.line.short_name
        }
    });
}

/**
 * transforms something like this geocFltrhVvDsEtA}ApSsVrDaEvAcBSYOS_@... to an
 * array of coordinates
 * 
 * source: https://github.com/react-native-maps/react-native-maps/issues/929#issuecomment-271365235
 */
function decode(t, e) {
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
