import { Scale } from "p2peq_event/dist/src/types";


export function ResolveScale( scale : Scale | number ) {
    if(scale === -1) return "不明"
    const _scale = scale.toString()
    switch( _scale ){
        case "10":
            return 1
        case "20":
            return 2
        case "30":
            return 3
        case "40":
            return 4
        case "45":
            return "5弱"
        case "50":
            return "5強"
        case "55":
            return "6弱"
        case "60":
            return "6強"
        case "70":
            return 7
    }
}