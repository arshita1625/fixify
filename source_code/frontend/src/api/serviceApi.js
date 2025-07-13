//to be implemented yet

import axios from "axios";

const URL = "http://localhost:3000"

export async function getAllServices() {
    const response = await axios.get(`${URL}/services`)

    if (response.status == 200) {
        return response.data
    } else {
        return // TODO error handling
    }
}

export async function getServicesByType(type) {
    const response = await axios.get(`${URL}/services/${type}`)

    if (response.status == 200) {
        return response.data
    } else {
        return // TODO error handling
    }
}