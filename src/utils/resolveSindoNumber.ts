import { Scale } from "p2peq_event/dist/src/types/jmaquake";


export function ResolveSindoString( sindo : string ) : Scale | -1 {
    switch ( sindo ) {
        case "1": return 10;
        case "2": return 20;
        case "3": return 30;
        case "4": return 40;
        case "5弱": return 45;
        case "5強": return 50;
        case "6弱": return 55;
        case "6強": return 60;
        case "7": return 70
        default : return -1
    }
}