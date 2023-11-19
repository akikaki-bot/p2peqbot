import { Colors } from "discord.js";
import { TsunamiTypes } from "p2peq_event/dist/src/types";



export function ResolveTsunamiColor ( grade : TsunamiTypes ) {
    switch( grade ) {
        case "MajorWarning":
            return Colors.DarkPurple
        case "Warning":
            return Colors.DarkRed
        case "Watch":
            return Colors.Yellow
        case "Unknown":
            return Colors.Aqua
    }
}