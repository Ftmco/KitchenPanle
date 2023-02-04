import { apiCall } from "..";
import { ApiResponse } from "../models/api.model";
import { UpsertNote } from "../models/note.model";
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

export const upsertNote = (upsert: UpsertNote): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.post(note.upsert, upsert)
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const deleteNote = (id: string): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.delete(note.delete(id))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })