
import { Typeofinfo } from "p2peq_event/dist/src/types" 

export function ResolveType( type : Typeofinfo ){
    switch(type) {
        case "Destination":
            return "震源に関する情報"
        case "ScalePrompt":
            return "震度速報"
        case "ScaleAndDestination":
            return "震度・震源に関する情報"
        case "DetailScale":
            return "各地の震度に関する情報"
        case "Foreign":
            return "遠地地震に関する情報"
        case "Other":
            return "その他の情報"
    }
}