

import { TsunamiTypes } from "p2peq_event/dist/src/types"

export function ResolveTsunamiType ( type : TsunamiTypes ){
    switch(type) {
        case "MajorWarning" :
            return "大津波警報"
        case "Warning":
            return "津波警報"
        case "Watch":
            return "津波注意報"
        case "Unknown":
            return "不明"
    }
}