import { Colors } from "discord.js";
import { Scale } from "p2peq_event/dist/src/types";



export function ResolveSindoColor ( _sindo : Scale ) {
    const sindo = _sindo.toString();
    switch ( sindo ) {
        case "10":
            return Colors.LightGrey
        case "20":
            return Colors.Aqua
        case "30":
            return Colors.Green
        case "40":
            return Colors.Yellow
        case "45":
            return Colors.Orange
        case "50":
            return Colors.DarkOrange
        case "55":
            return Colors.Red
        case "60":
            return Colors.DarkRed
        case "70":
            return Colors.Purple
        default:
            return Colors.White
    }
}