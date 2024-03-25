import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getScheduledRoutes(stopCode){
    // stopcode should be a number 1000 -> 2303
    const { data } = await axios.get((`${ROOT}/GetScheduledRoutes?stopCode=${stopCode}&serviceDate=`));
    json = xml2js(data, { compact: true });
    scheduledStops = json.DocumentElement.ScheduledRoutes;
    
    //when size is 1, data will be formatted as {}, when we need it as [] for mapping
    if(Array.isArray(scheduledStops)){
        busRoutes = scheduledStops.map(route => [route.RouteName._text, route.RouteColor._text, route.RouteShortName._text, route.RouteTextColor._text, route.RouteURL._text, route.ServiceLevel._text]);
    }
    else{
        busRoutes = [[scheduledStops.RouteName._text, scheduledStops.RouteColor._text, scheduledStops.RouteShortName._text, scheduledStops.RouteTextColor._text, scheduledStops.RouteURL._text, scheduledStops.ServiceLevel._text]];
    }
    //const busRoutes = formatScheduledStops(scheduledStops)
    console.log(busRoutes);
    return busRoutes;
}

export async function getAllStops() {
    const { data } = await axios.get(`${ROOT}/GetScheduledStopCodes?routeShortName=`);
    //console.log(data);
    json = xml2js(data, { compact: true });
    scheduledStops = json.DocumentElement.ScheduledStops;
    const stops = scheduledStops.map(stop =>  [stop.StopCode._text, stop.StopName._text]);
    //console.log(stops)
    //return a list of [stopCode, stopName]
    //console.log(stops)
    return stops;
}

