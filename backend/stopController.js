import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./apiUtil";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";
const STOPS = {};
/**
 * Fetches all stops for a route
 * @param {string} routeCode route name abbreviation (ex: "HWA")
 * @returns list of stops for that route
 */
export async function getStops(routeCode) {
    if (STOPS[routeCode]) return STOPS[routeCode];
    const { data } = await axios.get(`${ROOT}/GetScheduledStopInfo?routeShortName=${routeCode}&serviceDate=`);

    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.ScheduledStops;
    json = json.map(stop => formatTextProperty(stop));
    STOPS[routeCode] = json;

    return json;
}

export async function getNextDeparturesForStop(routeShortName, stopCode) {
    const noTrips = 5;
    const { data } = await axios.get(`${ROOT}/GetNextDeparturesForStop?routeShortName=${routeShortName}&noOfTrips=${noTrips}&stopCode=${stopCode}`);

    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.NextDepartures;
    json = json.map(stop => formatTextProperty(stop));

    return json;

}

export async function favoriteStopsToRouteList(allStops, favoriteStops){

    console.log("HERE HERE HERE");
    console.log(favoriteStops);
    const stopRoutes = [];
    for (const stop of allStops){
        //console.log(stop[0]);
        if (favoriteStops.includes(stop[0])){
            const stopRoute = {
                RouteColor: '000000',
                RouteName: stop[1],
                RouteShortName: stop[0]
            };
            console.log(stopRoute);
            stopRoutes.push(stopRoute);
        }
    }
    console.log(stopRoutes);
    return stopRoutes;
}
