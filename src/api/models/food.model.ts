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