



export function ResolveNullishNumber( number : number | -1 , args ?: string) {
    return number === -1 ? "不明" : typeof args !== "undefined" ? number+args : number
}