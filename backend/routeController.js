import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./util";
import { json } from "stream/consumers";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";


//create the routeList here
routeStops = []

export async function getScheduledRoutes(stopCode) {
    // stopcode should be a number 1000 -> 2303
    // leaving servicedate as blank because it auto-searches for today's date
    const { data } = await axios.get((`${ROOT}/GetScheduledRoutes?stopCode=${stopCode}&serviceDate=`));
    json = xml2js(data, { compact: true });
    scheduledStops = json.DocumentElement.ScheduledRoutes;

    //when size is 1, data will be formatted as {}, when we need it as [] for mapping
    if (Array.isArray(scheduledStops)) {
        busRoutes = scheduledStops.map(route => [route.RouteName._text, route.RouteColor._text, route.RouteShortName._text, route.RouteTextColor._text, route.RouteURL._text, route.ServiceLevel._text]);
    }
    else {
        busRoutes = [[scheduledStops.RouteName._text, scheduledStops.RouteColor._text, scheduledStops.RouteShortName._text, scheduledStops.RouteTextColor._text, scheduledStops.RouteURL._text, scheduledStops.ServiceLevel._text]];
    }

    return busRoutes;
}

export async function getAllStops() {
    const { data } = await axios.get(`${ROOT}/GetScheduledStopCodes?routeShortName=`);
    json = xml2js(data, { compact: true });
    scheduledStops = json.DocumentElement.ScheduledStops;
    const stops = scheduledStops.map(stop => [stop.StopCode._text, stop.StopName._text]);

    return stops;
}


//returns a list of all of stop times for the specified route
export async function getStopTimesForRoute(route){
    trips = 1
    const { data } = await axios.get((`${ROOT}/GetArrivalAndDepartureTimesForRoutes?routeShortNames=${route}&noOfTrips=${trips}&serviceDate=`));
    json = xml2js(data, { compact: true });
    json = json.DocumentElement.DeparturesForRoute;
    json = json.map(stop => formatTextProperty(stop));

    populateStopListForRoute(json)
    return json;

}

/**
 * populates a local stoplist with a list of the stoptimes and stops
 * caches this so that we do not have to keep calling a method
 */
function populateStopListForRoute(routeJson){
    for (item in routeJson){
        newStop = {
            stopName: routeJson.StopName,
            stopCode: routeJson.StopCode,
            longitude: 0,
            latitude: 0,
            arrivalTime: routeJson.CalculatedArrivalTime,
            departureTime: routeJson.CalculatedDepartureTime
        }
        routeStops.push(newStop)
    }
}
