export interface UpsertInventory {
    id?: string | null
    name: string
    value: number
    alertLimit: number
    typeId: string
    description: string
    groupId: string
}

export interface TypeConvert {
    typeId: string
    toTypeId: string
    value: number
    toValue: number
}