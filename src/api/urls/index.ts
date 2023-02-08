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

export const inventory = {
    inventories: (page: number, count: number) => `/Inventory/Inventory?page=${page}&count=${count}`,
    preview: '/Inventory/Preview',
    upsert: "/Inventory/Upsert",
    delete: (id: string) => `/Inventory/Delete?id=${id}`
}

export const food = {
    foods: (page: number, count: number) => `/Food/Foods?page=${page}&count=${count}`,
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