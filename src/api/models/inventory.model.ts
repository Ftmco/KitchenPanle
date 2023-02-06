export interface UpsertInventory {
    id?: string | null
    name: string
    value: number
    alertLimit: number
    typeId: string
    description: string
}