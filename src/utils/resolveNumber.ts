



export function ResolveNullishNumber( number : number | -1 , args ?: string) {
    return number === -1 ? "不明" : 
    number === 0 ? "ごく浅い" :
    typeof args !== "undefined" ? number+args : number
}