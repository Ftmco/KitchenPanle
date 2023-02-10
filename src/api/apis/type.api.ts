import { Pagination } from "@/components/models";
import { apiCall } from "..";
import { ApiResponse } from "../models/api.model";
import { TypeConvert } from "../models/inventory.model";
import { baseURLs, type } from "../urls";

const axios = apiCall(baseURLs(false))

export const getTypes = (pagination: Pagination): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.get(type.types(pagination))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const upsertType = (upsert: any): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.post(type.upsert, upsert)
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const deleteType = (id: any): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.delete(type.delete(id))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

// Conversions

export const getTypeConversions = (id: string): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.get(type.conversions(id))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const addTypeConvert = (convert: TypeConvert): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.post(type.addConvert, convert)
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const deleteTypeConvert = (id:string): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.delete(type.removeConvert(id))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })