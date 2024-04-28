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

    const stopRoutes = [];
    for (const stop of allStops){
        
        if (favoriteStops.includes(stop[0])){
            const stopRoute = {
                RouteColor: '000000',
                RouteName: stop[1],
                RouteShortName: stop[0]
            };
        
            stopRoutes.push(stopRoute);
        }
    }
    
    return stopRoutes;
}


/**
 * Hardcodes time delays for foot traffic and heavy traffic areas around balcksburg during the week
 * Hardcoded times can differ, meant for use in updating arrival times
 * @param {*} route  route to see if there are delays
 * 
 * @return returns the expected delay time, in minutes
 */
export function getRouteTrafficPattern(route){
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();

    //main street routes: MSS, MSN, PHD, HDG, PRO, PHB
    //prices fork routes: PRO, HWA, HWB, TOM, UCB
    //on campus routes: CRB, HXP, HDG, CRC

    //Mon and Wed
    if (day == 1 || day == 3){
        switch (hour){
            case hour >= 10 && hour <= 11:
                //heavy traffic for these toures
                if(route == 'PHB' || route == 'CRB' || route == 'HXP' || route == 'HWA'){
                    return 5;
                }
                //slight traffic for these routes
                else if (route == 'UCB' ||  route == 'HDG'){
                    return 3;
                }
                break;
            //heaviest traffic for these routes
            case hour > 11 && hour <= 15:
                if(route == 'PHB' || route == 'CRB' || route == 'HXP' || route == 'HWA' || route == 'TOM' || route == 'PHD' || route == 'PRO' || route == 'HWB' ){
                    return 3;
                }
                break;
            case hour > 16 && hour < 18:
                if(route == 'TOM' || route == 'UCB' || route == 'HWA' || route == 'HWB' || route == 'PRO')
                {
                    return 7;
                }
                break; 

        }

    }
    //Tue and Thur
    else if (day == 2 || day == 4){
        switch (hour){
            case hour >= 10 && hour <= 11:
                if(route == 'PHB' || route == 'CRB' || route == 'HXP' || route == 'HWA' || route == 'HDG' ){
                    return 3;
                }
                break;
            case hour > 11 && hour <= 12:
                if(route == 'CRB' || route == 'HXP'){
                    return 2;
                }
                break;
            case hour > 12 && hour < 13:
                if(route == 'PRO' || route == 'MSN' || route == 'TOM' || route == 'UCB'){
                    return 3;
                }
                break;
            case hour >= 13 && hour <= 15:
                if(route == 'PHB' || route == 'CRB' || route == 'HXP' || route == 'HWA' || route == 'TOM' || route == 'PHD' || route == 'PRO' || route == 'HWB' || route == 'HDG' ){
                    return 5;
                }
                break;
            case hour > 16 && hour < 18:
                if(route == 'TOM' || route == 'UCB' || route == 'HWA' || route == 'HWB' || route == 'PRO')
                {
                    return 7;
                }
                break; 

        }   
    }
    //Sat and Sun
    else if (day == 0 || day == 6){
        if((hour >= 12 && hour <= 14) && (route == 'UCB' || route == 'TOM'))
        {
            return 3;
        }

    }

    return 0;

}
