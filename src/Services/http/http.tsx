import axios from "axios";
const baseUrl = process.env.REACT_APP_API_URL;

type optionsType = {
    url: string
    method: string,
    data?: {},
    headers?: object
    params?: {}
}

const assignToken = (options: optionsType) => {
    let tokenObj = { token: localStorage.getItem('token') };
    options.headers ? Object.assign(options.headers, tokenObj) : Object.assign(options, { headers: tokenObj });
    return options;
}

// Global 401 interceptor — force-logout users whose account was deleted or blocked
axios.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) {
            const msg: string = error?.response?.data?.message || '';
            const isAccountGone = msg.includes('deleted') || msg.includes('blocked') || msg.includes('Account');
            if (isAccountGone) {
                localStorage.removeItem('token');
                localStorage.removeItem('userDetails');
                sessionStorage.removeItem('mpinVerified');
                // Show the server message briefly before redirect (if toast is available)
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

const http = (options: optionsType, noToken = false) => {
    let ops: optionsType = {
        url: baseUrl + options.url,
        method: options.method,
        data: options.data,
        headers: noToken ? options.headers : assignToken(options).headers
    };
    if (options.method === 'get') {
        ops.params = options.data;
    } else {
        ops.data = options.data;
    }
    return axios(ops);
}
export default http;
