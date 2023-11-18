import { Tsunamitype } from "p2peq_event/dist/src/types";

export function ResolveTsunamiInfomation( infokind : Exclude<Tsunamitype | "NonEffective", "NoneEffective"> | string) {
    
    switch( infokind ) {
        case "Unknown":
            return "この地震による津波の情報は現在調査中、もしくは不明です。"
        case "MajorWarning":
            return "この地震により、大津波警報が発令されている地域があります。"
        case "Warning":
            return "この地震により、津波警報が発令されている地域があります。"
        case "Watch":
            return "この地震により、津波注意報が発令されている地域があります。"
        case "Checking":
            return "この地震による津波の情報は現在調査中です。"
        case "None":
            return "この地震による津波の心配はありません。"
        case "NonEffective":
            return "この地震により、若干の海面変動等は見受けられますが被害の心配はありません。"
        default :
            return `不明なTsunamiTypeです。 : このTypeは型は範囲外です。-> ${infokind}`
    }
}