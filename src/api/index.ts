import Axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

const _headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
}

const _confing: AxiosRequestConfig = {
    headers: _headers
}

export const apiCall =
    (baseUrl: string, headers: Array<ApiHeader> = [{ key: '', value: '' }]): AxiosInstance => {
        _confing.baseURL = baseUrl
        headers.forEach((header) => {
            if (header.key != "")
                _confing.headers![header.key] = header.value
        })
        return Axios.create(_confing)
    }

export interface ApiHeader {
    key: string
    value: string
}