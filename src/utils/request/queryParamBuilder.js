export const buildQuery = (paramObject) => {
    let queryString = "?"
    const totalParams = Object.keys(paramObject) .length
    Object.keys(paramObject).forEach((key, index) => {
        if(paramObject[key]){
            queryString += `${key}=${paramObject[key]}`
        }

        if(index < totalParams - 1){
            queryString += '&'
        }
    })

    return queryString
}