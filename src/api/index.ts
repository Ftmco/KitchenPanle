import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'


const _headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
}

const _confing: AxiosRequestConfig = {
    headers: _headers
}

export const changeConfigHeader = (key: any, value: string) => {
    _headers[key] = value;
};

export const apiCall = (baseUrl: string, headers: [{ key: string, value: string }] = [{ key: "", value: "" }]) => {
    _confing.baseURL = baseUrl
    headers.forEach((header) => {
        if (header.key != "")
            (_confing.headers as AxiosRequestHeaders)[header.key] = header.value
    })
    return Axios.create(_confing)
}


