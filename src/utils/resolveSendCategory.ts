
export type SendCategory = {
    type : 1,
    description : "全ての情報"
} | {
    type : 2,
    description : "緊急地震速報（警報）のみ"
} | {
    type : 3,
    description : "緊急地震速報のみ"   
} | {
    type : 4,
    description : "震度速報・震源情報・各地の震度情報のみ"
} | {
    type : 5,
    description : "津波情報のみ"
}

export function ResolveSendCategory( categoryNum : number ) : SendCategory {
    if( categoryNum === 0 || categoryNum > 6 ) return { type : 1 , description : "全ての情報" }
    switch ( categoryNum ) {
        case 1:
            return { type : 1 , description : "全ての情報" }
        case 2:
            return { type : 2 , description : "緊急地震速報（警報）のみ"}
        case 3:
            return { type : 3 , description : "緊急地震速報のみ" }
        case 4:
            return { type : 4, description : "震度速報・震源情報・各地の震度情報のみ" }
        case 5:
            return { type : 5, description : "津波情報のみ"}
        default:
            return { type : 1, description : "全ての情報"}
    }
}