import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import AxiosMockAdapter from "axios-mock-adapter";
export const req = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
export const mock = new AxiosMockAdapter(req);
req.interceptors.request.use(async (config) => {
    let uuid = localStorage.getItem('uuid');
    if (!uuid) {
        uuid = uuidv4();
        localStorage.setItem('uuid', uuid);
    }
    config.headers["uuid"] = uuid;
    return config;
});
req.interceptors.response.use((response) => {
    return response.data;
});