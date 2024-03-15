export const selectArray = (data: any[]) => {
    return data.filter((data, index) => {
        return index <= 10;

    })
}