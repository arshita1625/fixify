import axios from "axios";

const URL = "http://localhost:3000"
export async function getAllServiceProviders() {
    const response = await axios.get(`${URL}/serviceProviders`)

    if (response.status == 200) {
        return response
    } else {
        console.error("Error fetching profile data:", error);
        return
    }
}

export async function getVerifiedServiceProviders() {
    const response = await axios.get(`${URL}/verified/serviceProviders`)
    console.log("service providers res", response);
    if (response.status == 200) {
        return response
    } else {
        console.error("Error fetching profile data:", error);
        return
    }
}