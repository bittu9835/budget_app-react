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