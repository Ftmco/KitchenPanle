export interface UpsertFood {
    id?: string | null
    name: string
    type: number
}

export interface AddNorm {
    foodId: string
    inventoryId: string
    typeId: string
    value: number
}

export interface UpsertDayFood {
    dayId: string
    foodId: string
    meal: string
    type: number
}