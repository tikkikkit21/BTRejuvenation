import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

/**
 * Fetches info on every bus that's currently running
 * 
 * @returns list of bus info as JS objects
 */
export async function getAllBuses() {
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.LatestInfoTable;

    json = json.map(bus => formatBus(bus));
    return json;
}

/**
 * Fetches info about a particular bus
 * 
 * @param {string} shortName abbreviated bus name (ex: "HWA")
 * @returns info on bus as JS object
 */
export async function getBus(shortName) {
    const json = await getAllBuses();
    const bus = json.find(bus => bus.RouteShortName == shortName);
    return bus;
}

function formatBus(busData) {
    for (const key of Object.keys(busData)) {
        busData[key] = busData[key]._text;
    }

    return busData;
}
