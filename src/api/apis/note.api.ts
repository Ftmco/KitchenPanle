import { apiCall } from "..";
import { ApiResponse } from "../models/api.model";
import { baseURLs, note } from "../urls";

const axios = apiCall(baseURLs(false));

export const getNotes = (page: number, count: number): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.get(note.notes(page, count))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })