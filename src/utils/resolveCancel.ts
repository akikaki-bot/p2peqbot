

export function ResolveCancel( isCancel : boolean , text : string ) {
    return isCancel ? `~~${text}~~` : text
} 

export function IfCancel( isCancel : boolean , text : string ) {
    return isCancel ? `先ほどの緊急地震速報はキャンセルされました。` : text
}