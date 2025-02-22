import axios from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfos";

//const baseURL = `http://192.168.100.194:3001` // ip của wifi HuyNguyen Change 03/01/2024
const baseURL = `http://192.168.100.151:3002` // Máy Dell HuyBen99 Mua 3tr 
// const baseURL = `http://192.168.2.125:3002`

const getAccessToken = () => {
    const res = localStorage.getItem(localDataNames.authData);
    return res ? JSON.parse(res).token : '';
}

const axiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params)
})

axiosClient.interceptors.request.use(async (config: any) => {
    const accessToken = getAccessToken();

    config.headers = {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        Accept: 'application/json',
        ...config.headers,
    };

    return { ...config, data: config.data ?? null }
})

axiosClient.interceptors.response.use(
    (res) => {
        if (res.data && res.status >= 200 && res.status < 300) {
            return res.data
        }
        else {
            return Promise.reject(res.data)
        }
    },
    (error) => {
        const { response } = error
        return Promise.reject(response.data)
    }
)
export default axiosClient