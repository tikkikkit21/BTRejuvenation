import axios from "axios";
import { xml2js } from "xml-js";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getAllBuses() {
    console.log("PATH:", `${ROOT}/GetCurrentBusInfo`)
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`)
    json = xml2js(data, {compact: true})
    json = json.DocumentElement.LatestInfoTable
    console.log(json)
}
