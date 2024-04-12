import axios from "axios";
import { xml2js } from "xml-js";
require('dotenv').config(); 
import { getScheduledRoutes, getStopTimesForRoute } from "./routeController";
import { LayoutAnimation } from "react-native";
import { getBus } from "./busController";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";


export function getExpectedRouteDelay(route){
    /**
     * get route start destination
     * get route end destination
     * then use the google maps api to see if there is heavy traffic in that area
     */
    startStop, midPointStop, endStop = getStartAndEndForRoute(route);
    delay = getTrafficDelay(startStop, midPointStop, endStop)
   
}

/**
 * 
 * @param {*} route route short code
 * gets the start and ending stop with long/lats
 */
function getStartAndEndForRoute(route){
    //calls BT API to get list of schedules stops per route
    stops = getScheduledStopTimesForRoute(route);

    midpoint = stops.length/2;
    endpoint = stops.length - 1;
    firstStop = stops[0];

    //the midpoint is normally from where the busses will turn around and begin to come back, so we want the midpoint
    midPointStop = stops[midpoint];
    endStop = stops[end];
    return firstStop,  midPointStop, endStop;

 }


/**
 * 
 * @param {*} startStop start point for a route for teh API call
 * @param {*} midpoint midpoint for a route, used to connect two and combine traffic info, can be null if only start and end
 * @param {*} endStop  endpoint for a route for the api call
 */
export function getTrafficDelay(startStop, midStop, endStop){
    startLat = startStop.Latitude;
    startLong = startStop.Longitude;

    origin = `${startLat},${startLong}`

    totalTrafficDuration = 0;

    if(midStop != null){
        midLat = midStop.Latitude;
        midLong = midStop.Longitude;
        destination = `${midLat},${midLong}`
        //make api request here
        midpointTrafficDuration =  makeApiRequest(origin, destination);

        totalTrafficDuration += midpointTrafficDuration;
    }

    /**
     * Used for midpoint -> endpoint, or simply if we want to see a whole route's expected duration in traffic
     * will be null for two stops
     */
    if(endStop != null){
        endLat = endStop.Latitude;
        endLong = endStop.Longitude;
        destination = `${endLat},${endLong}`
        //make second api request here
        endPointTrafficDuration = makeApiRequest(origin, destination);
        
        totalTrafficDuration += endPointTrafficDuration;
    }
    /**
     * use the google maps to see if there is a delay
     */
    return totalTrafficDuration;

}

/**
 * meant for two traffic stops
 * @param {*} startStop source
 * @param {*} endStop destination
 * @returns minutes in traffic
 */
export function twoWayTrafficDelay(startStop, endStop){

    startLat = startStop.Latitude;
    startLong = startStop.Longitude;
    origin = `${startLat},${startLong}`;
    
        
    endLat = endStop.Latitude;
    endLong = endStop.Longitude;
    destination = `${endLat},${endLong}`;

    durationInTraffic = makeApiRequest(origin, destination);


    return durationInTraffic;
        
}


/**
 * makes the call to the google maps api
 */
async function makeApiRequest(origin, destination){
    const apiUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; 
    const now = Date.getTime() / 100;
    const params = {
        origin: origin,
        destination: destination,
        mode: 'driving',
        departure_time: now,
        key: apiKey
    };
    try {
        const response = await axios.get(apiUrl, { params });
        // get duration spent in traffic
        const durationInTraffic = response.data.routes[0].legs[0].duration_in_traffic.text;
        //console.log(response.data);
        console.log(durationInTraffic);
        return durationInTraffic;
    } catch (error) {
        console.error('bad api request', error);
        throw error; 
        
    }

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
        if((hour >= 12 && hour <= 14) && route == 'UCB' || route == 'TOM')
        {
            return 3;
        }
            
    }

    return 0;

}

/**
 * more specific general stop delays for stops per route
 * 
 * @param {*} route  route short code 
 */
function getStopDelay(route){
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();

    bus = getBus(route);

    busLat = bus.Latitude;
    busLong = bus.Longitude;

    if(bus.IsAtStop == 'N'){
        call getScheduledStopInfo(route)
        or 
        call getArrivalandDepartureTimesPerRoute(route)

        stop[0] = nearest stop

        stop[0].Latitude
        stop[0].Longitude


        

        /**
         * now call the google maps api 
         * get distance 
         * 
         * if distance == scheduled stop time
         * 
         * then return 0
         * else return minutes behind
         * 
         * update timetables
         */

    }
    else{
        return 0; //bus is at stop already, cannot be behind
    }

    // get current bus info, then get the nearest stop
    // if the nearest stop is further than what is said on the api
    // then report it and modify the timetables

}


