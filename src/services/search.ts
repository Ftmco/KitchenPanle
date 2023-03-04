import { defaultPage } from "@/components/models";

let timeOut = 0;

export const searchList = (loadFunc: Function) => {
    if (timeOut != -1) {
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
        loadFunc(defaultPage, false)
    }, 400);
}