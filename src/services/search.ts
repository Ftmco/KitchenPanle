let timeOut = -1;

export const searchList = (loadFunc: Function, search: string) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        loadFunc({ page: 0, count: 0 }, search == "")
    }, 400);
}