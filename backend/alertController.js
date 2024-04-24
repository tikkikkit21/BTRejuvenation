import axios from "axios";
import { xml2js } from "xml-js";
import { formatTextProperty } from "./apiUtil";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getAlerts() {
    const { data } = await axios.get(`${ROOT}/GetActiveAlerts?alertTypes=&alertCauses=&alertEffects=`);
    // const { data } = await axios.get(`${ROOT}/GetAllAlerts`);
    let json = xml2js(data, { compact: true });
    json = json.DocumentElement.ActiveAlerts;
    console.log("json:", json.Error._text);

    if (json.Error._text.startsWith("No active alerts found for requested alert type(s):")) {
        return [];
    }

    json = json.map(alert => formatTextProperty(alert));
    console.log("json:", json[0]);
    return json;
}
