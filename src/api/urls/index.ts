export const baseURLs = (isPublic: boolean) => 'http://localhost:5293/api';

export const group = {
    groups: (page: number, count: number) => `/Group/Groups?page=${page}&count=${count}`,
    upsert: "/Group/Upsert",
    delete: (id: string) => `/Group/Delete?id=${id}`
}

export const note = {
    notes: (page: number, count: number) => `/Note/Notes?page=${page}&count=${count}`,
    upsert: "/Note/Upsert",
    delete: (id: string) => `/Note/Delete?id=${id}`
}

export const type = {
    types: (page: number, count: number) => `/MeasurementType/Types?page=${page}&count=${count}`,
    upsert: "/MeasurementType/Upsert",
    delete: (id: string) => `/MeasurementType/Delete?id=${id}`
}