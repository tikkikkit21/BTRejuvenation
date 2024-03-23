import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getStops(busCode) {
    const { data } = await axios.get(`${ROOT}/GetScheduledStopInfo?routeShortName=${busCode}&serviceDate=`);

    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.ScheduledStops;
    json = json.map(stop => formatStop(stop));
    
    return json;
}

function formatStop(stopData) {
    for (const key of Object.keys(stopData)) {
        stopData[key] = stopData[key]._text;
    }
    return stopData;
}
