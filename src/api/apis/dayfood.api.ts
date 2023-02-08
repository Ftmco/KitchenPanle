import { Pagination } from "@/components/models";
import { apiCall } from "..";
import { ApiResponse } from "../models/api.model";
import { MakeMeal, UpsertDayFood } from "../models/food.model";
import { baseURLs, dayfood } from "../urls";


const axios = apiCall(baseURLs(false))

export const getDaysFoods = (pagination: Pagination): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.get(dayfood.daysFoods(pagination))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const upsertDayFood = (upsert: UpsertDayFood): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.post(dayfood.upsert, upsert)
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const deleteDayFood = (id: string): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.delete(dayfood.delete(id))
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })

export const makeMeal = (meal: MakeMeal): Promise<ApiResponse> =>
    new Promise(async (resolve, reject) => {
        try {
            const request = await axios.post(dayfood.makeMeal, meal)
            const response = await request.data
            resolve(response as ApiResponse)
        } catch (error) {
            reject(error)
        }
    })