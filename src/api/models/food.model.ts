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
    id?: string | null
    dayId: string
    foodId: string
    meal: string
    type: number
}

export interface MakeMeal {
    id: string
    count: number
    description:string
}