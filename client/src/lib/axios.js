import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:  "https://dev-connect-drab.vercel.app/api/v1",
    withCredentials: true
})