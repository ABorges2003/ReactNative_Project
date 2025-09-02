import axios from "axios";
import { LIB_API_URL,ENDPOINTS } from "../utils/URL";

const api=axios.create({
    baseURL: LIB_API_URL,
    timeout: 5000,
})

const GetLibraries=()=> api.get(ENDPOINTS.GET_LIBRARY);

export {GetLibraries}