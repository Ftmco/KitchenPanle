import { pageListSize } from "@/constants";

export interface Dialog {
    title: string;
    color: string;
    content: DialogContent
}

export interface DialogContent {
    component: {};
    props: {}
}

export interface DialogResult {
    status: boolean
    data: any
}

export interface ConfirmDialog {
    title: string
    text: string
    agreeText: string
    disagreeText: string
    data: any
}

export interface ConfirmResult {
    agree: boolean
    data: any
}

export interface TableHeaderModel {
    text: string
    align: string
    sortable: boolean
    value: string
}

export interface Pagination {
    page: number
    count: number
}

export const defaultPage: Pagination = {
    page: 0,
    count: pageListSize
}