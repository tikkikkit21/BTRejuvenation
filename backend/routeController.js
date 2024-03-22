import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

// TODO: format output like in getBus()
export async function getAllRoutes() {
    const { data } = await axios.get(`${ROOT}/GetCurrentRoutes`);
    json = xml2js(data, { compact: true });
    json = json.DocumentElement.CurrentRoutes;

    json.map(allRoutes => formatAllRoutes(allRoutes));

    // console.log(json)
    return json;
}

// export async function getRoute(shortName) {
//     const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
//     json = xml2js(data, { compact: true });
//     json = json.DocumentElement.LatestInfoTable;

//     bus = json.find(bus => bus.RouteShortName._text == shortName);
//     bus = formatBus(bus);
//     return bus;
// }

export async function getScheduledRoutes(stopCode){

    date = new Date()
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getYear()

    dateStr = `${day}\\${month}\\${year}`
    console.log(dateStr)


    // stopcode should be a number 1000 -> 2303

    const { data } = await axios.get((`${ROOT}/GetScheduledRoutes?stopCode=${stopCode}&serviceDate=${date}`));
    json = xml2js(data, { compact: true });
    json = json.DocumentElement.LatestInfoTable;

    json.map(scheduledRoutes => formatAllRoutes(scheduledRoutes));
    console.log(scheduledRoutes)
    return json;


}



function formatAllRoutes(allRoutes) {
    for (const key of Object.keys(allRoutes)) {
        routeData[key] = routeData[key]._text;
    }

    return routeData;
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

