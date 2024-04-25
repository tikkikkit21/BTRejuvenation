import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./apiUtil";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";
const ALERTS = [];
var hasCached = false;

export async function getAlerts() {
    if (hasCached) return ALERTS;
    // const { data } = await axios.get(`${ROOT}/GetActiveAlerts?alertTypes=&alertCauses=&alertEffects=`);
    const { data } = await axios.get(`${ROOT}/GetAllAlerts`);
    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.ActiveAlerts;

    if (json.Error?._text?.startsWith("No active alerts found for requested alert type(s):")) {
        return [];
    }

    json = json.map(alert => formatTextProperty(alert));

    ALERTS.push(...json);
    hasCached = true;
    return json;
}
