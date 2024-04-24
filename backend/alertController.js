import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./apiUtil";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getAlerts() {
    // const { data } = await axios.get(`${ROOT}/GetActiveAlerts`); 
    const { data } = await axios.get(`${ROOT}/GetAllAlerts`);
    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.ActiveAlerts;

    json = json.map(alert => formatTextProperty(alert));
    console.log("json:", json[0]);
    return json;
}
