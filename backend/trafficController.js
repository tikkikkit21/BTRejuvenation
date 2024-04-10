import axios from "axios";
import { xml2js } from "xml-js";
import { getScheduledRoutes, getStopTimesForRoute } from "./routeController";
import { LayoutAnimation } from "react-native";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

/**
 * create a method to get traffic information for map
 * 
 * then, after getting traffic information
 * 
 * create an alert that will display which routes are delayed
 * 
 * also, hardcode some alerts into the map -> main street routes expect delays on
 * weekdays between 5 and 6
 * 
 * on campus routes expect delays from people walking, could get to destination a few minutes late
 * 
 * foot traffic notifications
 * 
 * alert if there are any accidents or crashes
 */

export function getExpectedRouteDelay(route){
    /**
     * get route start destination
     * get route end destination
     * 
     * 
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
    stops = getScheduledRoutes(route);

    midpoint = stops.length/2;
    endpoint = stops.length - 1;

    firstStop = stops[0];


    //the midpoint is normally from where the busses will turn around and begin to come back, so we want the midpoint
    midPointStop = stops[midpoint];
    endStop = stops[end];
    return [firstStop,  midPointStop, endStop]

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

    if(midStop != null){
        midLat = midStop.Latitude;
        midLong = midStop.Longitude;
    }
    
    if(endStop != null){
        endLat = endStop.Latitude;
        endLong = endStop.Longitude;
    
    }
  

    /**
     * use the google maps to see if there is a delay
     */

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
            return 5;
        }
            
    }

    return 0;

}

function addTrafficAlert(){

}


