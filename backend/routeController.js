import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./apiUtil";


const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";
const ROUTES = [];

export const routeColorMap = {};

/**
 * Gets scheduled routes for a particular stop or every one
 * 
 * @param {number} stopCode stop code number (1000-2303), empty will return all routes
 * @returns list of bus routes that serve the stop
 * 
 */
export async function getScheduledRoutes(stopCode = "", popMap = true) {
    if (ROUTES.length > 0) return ROUTES;
    // leaving servicedate as blank because it auto-searches for today's date
    const { data } = await axios.get(`${ROOT}/GetScheduledRoutes?stopCode=${stopCode}&serviceDate=`);
    const json = xml2js(data, { compact: true });
    let scheduledStops = json.DocumentElement.ScheduledRoutes;

    // when size is 1, data will be formatted as {}, when we need it as [] for mapping
    if (!Array.isArray(scheduledStops)) {
        scheduledStops = [scheduledStops]
    }

    scheduledStops = scheduledStops.map(stop => formatTextProperty(stop));

    if (popMap) {
        populateMap(scheduledStops);
    }

    ROUTES.push(...scheduledStops);

    //console.log(scheduledStops);
    return scheduledStops;
}


/**
 * Fetches every stop
 * 
 * @returns list of every stop
 */
export async function getAllStops() {
    const { data } = await axios.get(`${ROOT}/GetScheduledStopCodes?routeShortName=`);
    const json = xml2js(data, { compact: true });
    let scheduledStops = json.DocumentElement.ScheduledStops;
    const stops = scheduledStops.map(stop => [stop.StopCode._text, stop.StopName._text]);

    return stops;
}

export async function getNextTrip(route) {
    trips = 1;
    const { data } = await axios.get(`${ROOT}/GetArrivalAndDepartureTimesForRoutes?routeShortNames=${route}&noOfTrips=${trips}&serviceDate=`);
    const json = xml2js(data, { compact: true });
    let trip = json.DocumentElement.DeparturesForRoute;
    trip = trip.map(stop => formatTextProperty(stop));

    return trip;

}

export async function getCurrentRoutes() {
    const { data } = await axios.get(`${ROOT}/GetCurrentRoutes`);
    const json = xml2js(data, { compact: true });

    let routes = json.DocumentElement.CurrentRoutes

    routes = routes.map(route => formatTextProperty(route));

    return routes;


}


function populateMap(routes) {

    routes.forEach(route => {
        routeColorMap[route.RouteShortName] = route.RouteColor;
    });

}


export async function getRoutesByCode(codeList) {
    if (codeList.length == 0) {
        console.log("no favorites");
    }
    let routesByCode = [];

    let allRoutes = await getScheduledRoutes();

    allRoutes.forEach(route => {
        if (codeList.includes(route.RouteShortName)) {
            routesByCode.push(route);
        }
    });

    return routesByCode;

}
