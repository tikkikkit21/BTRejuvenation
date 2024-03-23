import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getAllBuses() {
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
    json = xml2js(data, { compact: true });
    json = json.DocumentElement.LatestInfoTable;

    json.map(bus => formatBus(bus));
    return json;
}

export async function getBus(shortName) {
    const json = await getAllBuses();
    bus = json.find(bus => bus.RouteShortName == shortName);
    return bus;
}

function formatBus(busData) {
    for (const key of Object.keys(busData)) {
        busData[key] = busData[key]._text;
    }

    return busData;
}