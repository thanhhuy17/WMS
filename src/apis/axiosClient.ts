import axios from "axios";
import queryString from "query-string";

const baseURL = `http://192.168.100.194:3001`
const axiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params)
})

axiosClient.interceptors.request.use(async (config: any) => {
    config.headers = {
        Authorization: '',
        Accept: 'application/json',
        ...config.headers,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    config.data;
    return config
})

axios.interceptors.response.use(
    (res) => {
        if (res.data && res.status >= 200 && res.status < 300) {
            return res.data.data
        }
        else {
            return Promise.reject(res.data.data)
        }
    },
    (error) => {
        const { response } = error
        return Promise.reject(response.data.data)
    }
)
export default axiosClient