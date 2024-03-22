import axios from "axios";

const ROOT = "http://www.bt4uclassic.org/webservices/bt4u_webservice.asmx";

export async function getAllBuses() {
    console.log("PATH:", `${ROOT}/GetCurrentBusInfo`)
    const { data } = await axios.get(`${ROOT}/GetCurrentBusInfo`)
    console.log(data)
}
