import { defaultPage } from "@/components/models";

let timeOut = 0;

export const searchList = (q: string, loadFunc: Function) => {
    if (q != "") {
        if (timeOut != -1) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
            loadFunc(defaultPage(q))
        }, 300);
    }
}