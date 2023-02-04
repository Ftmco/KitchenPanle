import { base, importance } from "./status.enum"


export const getBaseStatusObj = (status: number): Status =>
    base.find((s) => s.status == status) as Status;

export const getNoteImportanceObj = (status: number): Status =>
    importance.find((s) => s.status == status) as Status;

export interface Status {
    status: number
    color: string
    title: string
}
