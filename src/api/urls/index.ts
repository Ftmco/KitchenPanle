import { Pagination } from "@/components/models";

export const baseURLs = (isPublic: boolean) => 'http://localhost:5293/api';

export const group = {
    groups: (pagination: Pagination) => `/Group/Groups?page=${pagination.page}&count=${pagination.count}`,
    upsert: "/Group/Upsert",
    delete: (id: string) => `/Group/Delete?id=${id}`
}

export const note = {
    notes: (pagination: Pagination) => `/Note/Notes?page=${pagination.page}&count=${pagination.count}`,
    upsert: "/Note/Upsert",
    delete: (id: string) => `/Note/Delete?id=${id}`
}

export const type = {
    types: (pagination: Pagination) => `/MeasurementType/Types?page=${pagination.page}&count=${pagination.count}`,
    upsert: "/MeasurementType/Upsert",
    delete: (id: string) => `/MeasurementType/Delete?id=${id}`,
    conversions: (id: string) => `/MeasurementType/Conversions?id=${id}`,
    addConvert: '/MeasurementType/AddConvert'
}

export const inventory = {
    inventories: (pagination: Pagination) => `/Inventory/Inventory?page=${pagination.page}&count=${pagination.count}`,
    preview: '/Inventory/Preview',
    upsert: "/Inventory/Upsert",
    delete: (id: string) => `/Inventory/Delete?id=${id}`
}

export const food = {
    foods: (pagination: Pagination) => `/Food/Foods?page=${pagination.page}&count=${pagination.count}`,
    upsert: "/Food/Upsert",
    delete: (id: string) => `/Food/Delete?id=${id}`
}

export const norm = {
    norms: (foodId: string) => `/Food/Norms?foodId=${foodId}`,
    addNorm: "/Food/AddNorm",
    delete: (id: string) => `/Food/RemoveNorm?id=${id}`
}

export const day = {
    days: "/Day/Days",
    add: "/Day/AddDay",
    delete: (id: string) => `/Day/Delete?id=${id}`
}

export const dayfood = {
    daysFoods: (pagination: Pagination) => `/DayFood/DaysFoods?page=${pagination.page}&count=${pagination.count}`,
    history: (pagination: Pagination) => `/FoodHistory/FoodHistories?page=${pagination.page}&count=${pagination.count}`,
    upsert: "/DayFood/Upsert",
    delete: (id: string) => `/DayFood/Delete?id=${id}`,
    makeMeal: '/DayFood/MakeMeal'
}