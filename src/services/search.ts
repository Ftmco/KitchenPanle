let timeOut = 0;

export const searchList = (loadFunc: Function,search:string) => {
    if (timeOut != -1) {
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
        loadFunc({ page: 0, count: 0 }, search != "")
    }, 400);
}