import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

/**
 * Gets every scheduled route for a particular stop
 * 
 * @param {number} stopCode stop code number (1000 - 2303)
 * @returns list of bus routes that serve the stop
 */
export async function getScheduledRoutes(stopCode) {
    // leaving servicedate as blank because it auto-searches for today's date
    const { data } = await axios.get(`${ROOT}/GetScheduledRoutes?stopCode=${stopCode}&serviceDate=`);
    const json = xml2js(data, { compact: true });
    let scheduledStops = json.DocumentElement.ScheduledRoutes;

    // when size is 1, data will be formatted as {}, when we need it as [] for mapping
    if (!Array.isArray(scheduledStops)) {
        scheduledStops = [scheduledStops]
    }
    
    scheduledStops = scheduledStops.map(stop => formatStop(stop));

    return scheduledStops;
}

/**
 * Fetches every stop
 * 
 * @returns list of every stop
 */
export async function getAllStops() {
    const { data } = await axios.get(`${ROOT}/GetScheduledStopCodes?routeShortName=`);
    json = xml2js(data, { compact: true });
    scheduledStops = json.DocumentElement.ScheduledStops;
    const stops = scheduledStops.map(stop => [stop.StopCode._text, stop.StopName._text]);

    return stops;
}

function formatStop(stopData) {
    for (const key of Object.keys(stopData)) {
        stopData[key] = stopData[key]._text;
    }

    return stopData;
}
