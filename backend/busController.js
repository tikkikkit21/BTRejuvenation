import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getAllBuses() {
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
    json = xml2js(data, { compact: true });
    json = json.DocumentElement.LatestInfoTable;

    console.log(json);
    return json;
}

export async function getBus(shortName) {
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`);
    json = xml2js(data, { compact: true });
    json = json.DocumentElement.LatestInfoTable;
    bus = json.find(bus => bus.RouteShortName._text == shortName);

    console.log(bus);
    return bus;
}
