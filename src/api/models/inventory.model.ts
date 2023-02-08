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
    fromTypeId: string
    toTypeId: string
    fromValue: number
    toValue: number
}